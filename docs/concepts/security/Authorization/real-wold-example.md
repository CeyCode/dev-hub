---
title: "Real-World Authorization Examples - TLMS"
sidebar_label: "TLMS Examples"
sidebar_position: 10
description: "Complete real-world examples of authorization implementation for a Teaching & Learning Management System (TLMS) with Admin, Instructor, and Student roles."
tags: [spring-boot, security, authorization, real-world-examples, tlms]
---

# Real-World Authorization Examples - TLMS (Teaching & Learning Management System)

This document shows how to implement authorization in a real Learning Management System with Admin, Instructor, and Student roles.

## System Overview

### Roles

- **ADMIN**: Full system access, manage users, courses, settings
- **INSTRUCTOR**: Create and manage courses, view student progress, grade assignments
- **STUDENT**: Enroll courses, submit assignments, view grades
- **GUEST**: View public course listings only

### Resources

- **Users**: Manage user accounts
- **Courses**: Create, update, delete courses
- **Assignments**: Create assignments (instructors), submit (students)
- **Grades**: View and update grades
- **Reports**: Generate analytics

---

## Authorization Service for TLMS

```java
package com.jdnbrothers.tlms.service.security;

import com.jdnbrothers.tlms.repository.*;
import com.jdnbrothers.tlms.security.principal.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

/**
 * TLMS-specific authorization service.
 * Handles role and ownership checks for courses, assignments, grades, etc.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class TlmsAuthorizationService {

    private final CourseRepository courseRepository;
    private final AssignmentRepository assignmentRepository;
    private final StudentEnrollmentRepository enrollmentRepository;
    private final GradeRepository gradeRepository;

    // ===== User Context =====

    public UserPrincipal getCurrentUser() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        return auth != null && auth.isAuthenticated() 
            ? (UserPrincipal) auth.getPrincipal() 
            : null;
    }

    public Long getCurrentUserId() {
        UserPrincipal user = getCurrentUser();
        return user != null ? user.getId() : null;
    }

    // ===== Role Checks =====

    public boolean isAdmin() {
        UserPrincipal user = getCurrentUser();
        return user != null && user.hasRole("ADMIN");
    }

    public boolean isInstructor() {
        UserPrincipal user = getCurrentUser();
        return user != null && user.hasRole("INSTRUCTOR");
    }

    public boolean isStudent() {
        UserPrincipal user = getCurrentUser();
        return user != null && user.hasRole("STUDENT");
    }

    public boolean isInstructorOrAdmin() {
        return isInstructor() || isAdmin();
    }

    // ===== User Management =====

    /**
     * Can view user profile: Self, Admin, or Instructor (for students in their courses)
     */
    public boolean canViewUserProfile(Long userId) {
        Long currentId = getCurrentUserId();
        if (currentId == null) return false;
        
        if (currentId.equals(userId) || isAdmin()) return true;
        
        // Instructor can view students in their courses
        if (isInstructor()) {
            return enrollmentRepository.existsStudentInInstructorCourses(userId, currentId);
        }
        
        return false;
    }

    /**
     * Can edit user: Self, Admin, or Instructor (self profile only)
     */
    public boolean canEditUserProfile(Long userId) {
        Long currentId = getCurrentUserId();
        if (currentId == null) return false;
        
        if (currentId.equals(userId)) return true;  // Can edit own profile
        if (isAdmin()) return true;                  // Admin can edit anyone
        
        return false;
    }

    /**
     * Can delete user: Admin only (prevent self-deletion)
     */
    public boolean canDeleteUser(Long userId) {
        Long currentId = getCurrentUserId();
        return isAdmin() && !currentId.equals(userId);
    }

    /**
     * Can change user roles: Admin only (prevent removing own admin)
     */
    public boolean canChangeRoles(Long userId) {
        Long currentId = getCurrentUserId();
        return isAdmin() && !currentId.equals(userId);
    }

    // ===== Course Management =====

    /**
     * Can view course: Admin, Instructor (owner), Student (enrolled), Guest (public)
     */
    public boolean canViewCourse(Long courseId) {
        Long currentId = getCurrentUserId();
        
        // Admin can view all
        if (isAdmin()) return true;
        
        var course = courseRepository.findById(courseId).orElse(null);
        if (course == null) return false;
        
        // Instructor can view own courses
        if (isInstructor() && course.getInstructorId().equals(currentId)) {
            return true;
        }
        
        // Student can view enrolled courses
        if (isStudent() && enrollmentRepository.isStudentEnrolled(courseId, currentId)) {
            return true;
        }
        
        // Anyone can view public courses
        return course.getIsPublic();
    }

    /**
     * Can create course: Admin and Instructor
     */
    public boolean canCreateCourse() {
        return isInstructorOrAdmin();
    }

    /**
     * Can edit course: Admin, Instructor (owner)
     */
    public boolean canEditCourse(Long courseId) {
        Long currentId = getCurrentUserId();
        
        if (isAdmin()) return true;
        
        if (!isInstructor()) return false;
        
        var course = courseRepository.findById(courseId).orElse(null);
        return course != null && course.getInstructorId().equals(currentId);
    }

    /**
     * Can delete course: Admin, Instructor (owner, no students enrolled)
     */
    public boolean canDeleteCourse(Long courseId) {
        Long currentId = getCurrentUserId();
        
        if (isAdmin()) {
            var course = courseRepository.findById(courseId).orElse(null);
            return course != null && enrollmentRepository.countByCourseId(courseId) == 0;
        }
        
        if (!isInstructor()) return false;
        
        var course = courseRepository.findById(courseId).orElse(null);
        if (course == null || !course.getInstructorId().equals(currentId)) {
            return false;
        }
        
        // Prevent deletion if students enrolled
        return enrollmentRepository.countByCourseId(courseId) == 0;
    }

    /**
     * Can manage course (edit settings, add students): Admin, Instructor (owner)
     */
    public boolean canManageCourse(Long courseId) {
        return canEditCourse(courseId);  // Same rules as editing
    }

    // ===== Assignment Management =====

    /**
     * Can view assignment: Admin, Instructor (course owner), Student (enrolled + published)
     */
    public boolean canViewAssignment(Long assignmentId) {
        Long currentId = getCurrentUserId();
        
        if (isAdmin()) return true;
        
        var assignment = assignmentRepository.findById(assignmentId).orElse(null);
        if (assignment == null) return false;
        
        Long courseId = assignment.getCourseId();
        
        // Instructor can view own course's assignments
        if (isInstructor()) {
            var course = courseRepository.findById(courseId).orElse(null);
            return course != null && course.getInstructorId().equals(currentId);
        }
        
        // Student can view if enrolled and published
        if (isStudent()) {
            boolean enrolled = enrollmentRepository.isStudentEnrolled(courseId, currentId);
            return enrolled && assignment.getIsPublished();
        }
        
        return false;
    }

    /**
     * Can create assignment: Admin, Instructor (course owner)
     */
    public boolean canCreateAssignment(Long courseId) {
        return canManageCourse(courseId);
    }

    /**
     * Can edit assignment: Admin, Instructor (course owner, no submissions)
     */
    public boolean canEditAssignment(Long assignmentId) {
        Long currentId = getCurrentUserId();
        
        if (isAdmin()) {
            var assignment = assignmentRepository.findById(assignmentId).orElse(null);
            return assignment != null && !assignment.hasSubmissions();
        }
        
        if (!isInstructor()) return false;
        
        var assignment = assignmentRepository.findById(assignmentId).orElse(null);
        if (assignment == null) return false;
        
        var course = courseRepository.findById(assignment.getCourseId()).orElse(null);
        if (course == null || !course.getInstructorId().equals(currentId)) {
            return false;
        }
        
        // Can't edit if students have submitted
        return !assignment.hasSubmissions();
    }

    /**
     * Can delete assignment: Admin, Instructor (course owner)
     */
    public boolean canDeleteAssignment(Long assignmentId) {
        Long currentId = getCurrentUserId();
        
        if (isAdmin()) {
            var assignment = assignmentRepository.findById(assignmentId).orElse(null);
            return assignment != null;
        }
        
        if (!isInstructor()) return false;
        
        var assignment = assignmentRepository.findById(assignmentId).orElse(null);
        if (assignment == null) return false;
        
        var course = courseRepository.findById(assignment.getCourseId()).orElse(null);
        return course != null && course.getInstructorId().equals(currentId);
    }

    // ===== Submission Management =====

    /**
     * Can view submission: Admin, Instructor (course owner), Student (own submission)
     */
    public boolean canViewSubmission(Long submissionId) {
        Long currentId = getCurrentUserId();
        
        if (isAdmin()) return true;
        
        var submission = assignmentRepository.getSubmission(submissionId).orElse(null);
        if (submission == null) return false;
        
        // Student can view own submission
        if (isStudent() && submission.getStudentId().equals(currentId)) {
            return true;
        }
        
        // Instructor can view student submissions in their courses
        if (isInstructor()) {
            var course = courseRepository.findById(submission.getCourseId()).orElse(null);
            return course != null && course.getInstructorId().equals(currentId);
        }
        
        return false;
    }

    /**
     * Can submit assignment: Student (enrolled, deadline not passed)
     */
    public boolean canSubmitAssignment(Long assignmentId) {
        Long currentId = getCurrentUserId();
        
        if (!isStudent()) return false;
        
        var assignment = assignmentRepository.findById(assignmentId).orElse(null);
        if (assignment == null || !assignment.getIsPublished()) {
            return false;
        }
        
        // Check if deadline passed
        if (assignment.getDueDate() != null && 
            assignment.getDueDate().isBefore(java.time.LocalDateTime.now())) {
            return false;
        }
        
        // Check if enrolled
        return enrollmentRepository.isStudentEnrolled(assignment.getCourseId(), currentId);
    }

    // ===== Grading =====

    /**
     * Can grade submission: Admin, Instructor (course owner)
     */
    public boolean canGradeSubmission(Long submissionId) {
        Long currentId = getCurrentUserId();
        
        if (isAdmin()) return true;
        
        if (!isInstructor()) return false;
        
        var submission = assignmentRepository.getSubmission(submissionId).orElse(null);
        if (submission == null) return false;
        
        var course = courseRepository.findById(submission.getCourseId()).orElse(null);
        return course != null && course.getInstructorId().equals(currentId);
    }

    /**
     * Can view grades for student: Self, Admin, Instructor (course owner)
     */
    public boolean canViewStudentGrades(Long studentId) {
        Long currentId = getCurrentUserId();
        
        if (currentId.equals(studentId)) return true;  // Own grades
        if (isAdmin()) return true;
        
        // Instructor can view grades for students in their courses
        if (isInstructor()) {
            return enrollmentRepository.existsStudentInInstructorCourses(studentId, currentId);
        }
        
        return false;
    }

    // ===== Analytics & Reports =====

    /**
     * Can access course analytics: Admin, Instructor (course owner)
     */
    public boolean canAccessCourseAnalytics(Long courseId) {
        return canManageCourse(courseId);
    }

    /**
     * Can generate system reports: Admin, Instructor (own courses only)
     */
    public boolean canGenerateReports() {
        return isInstructorOrAdmin();
    }

    /**
     * Can export course data: Admin, Instructor (course owner)
     */
    public boolean canExportCourseData(Long courseId) {
        return canManageCourse(courseId);
    }

    // ===== Enrollment Management =====

    /**
     * Can enroll student: Admin, Self (if public), Instructor (own course)
     */
    public boolean canEnrollStudent(Long courseId, Long studentId) {
        Long currentId = getCurrentUserId();
        
        if (isAdmin()) return true;
        
        if (isStudent() && currentId.equals(studentId)) {
            var course = courseRepository.findById(courseId).orElse(null);
            return course != null && course.getIsPublic();
        }
        
        if (isInstructor()) {
            var course = courseRepository.findById(courseId).orElse(null);
            return course != null && course.getInstructorId().equals(currentId);
        }
        
        return false;
    }

    /**
     * Can remove student from course: Admin, Instructor (course owner)
     */
    public boolean canRemoveStudentFromCourse(Long courseId, Long studentId) {
        Long currentId = getCurrentUserId();
        
        if (isAdmin()) return true;
        
        if (!isInstructor()) return false;
        
        var course = courseRepository.findById(courseId).orElse(null);
        return course != null && course.getInstructorId().equals(currentId);
    }

    // ===== Utility Methods =====

    /**
     * Get courses current user can manage (for filtering list views)
     */
    @Cacheable(value = "managedCourses", key = "#currentId")
    public java.util.List<Long> getManagedCourseIds(Long currentId) {
        if (isAdmin()) {
            return courseRepository.findAllIds();
        }
        
        if (isInstructor()) {
            return courseRepository.findByInstructorId(currentId).stream()
                .map(course -> course.getId())
                .toList();
        }
        
        return java.util.Collections.emptyList();
    }
}
```

---

## TLMS Controllers with Authorization

### 1. Course Controller

```java
package com.jdnbrothers.tlms.controller;

import com.jdnbrothers.tlms.dto.CourseDTO;
import com.jdnbrothers.tlms.service.CourseService;
import com.jdnbrothers.tlms.service.security.TlmsAuthorizationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * Course Management API
 * 
 * Authorization:
 * - GET /api/courses: Anyone (public courses only for guests)
 * - GET /api/courses/{id}: Owner, Enrolled, Admin
 * - POST /api/courses: Admin, Instructor
 * - PUT /api/courses/{id}: Owner, Admin
 * - DELETE /api/courses/{id}: Owner (no students), Admin
 */
@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;
    private final TlmsAuthorizationService authService;

    /**
     * List all accessible courses
     * - Admin: all courses
     * - Instructor: own courses
     * - Student: enrolled courses + public courses
     * - Guest: public courses only
     */
    @GetMapping
    public ResponseEntity<Page<CourseDTO>> listCourses(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            Pageable pageable) {
        
        Page<CourseDTO> courses = courseService.listAccessibleCourses(
            search, category, pageable);
        
        return ResponseEntity.ok(courses);
    }

    /**
     * Get course details
     * Authorization: Owner, Enrolled, Admin, or Public
     */
    @GetMapping("/{id}")
    public ResponseEntity<CourseDTO> getCourse(@PathVariable Long id) {
        // Authorization check at method level
        return ResponseEntity.ok(courseService.getCourse(id));
    }

    /**
     * Create new course (Instructor, Admin)
     */
    @PostMapping
    @PreAuthorize("@tlmsAuthService.canCreateCourse()")
    public ResponseEntity<CourseDTO> createCourse(@RequestBody CreateCourseRequest request) {
        CourseDTO course = courseService.createCourse(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(course);
    }

    /**
     * Update course (Owner, Admin)
     */
    @PutMapping("/{id}")
    @PreAuthorize("@tlmsAuthService.canEditCourse(#id)")
    public ResponseEntity<CourseDTO> updateCourse(
            @PathVariable Long id,
            @RequestBody UpdateCourseRequest request) {
        
        CourseDTO updated = courseService.updateCourse(id, request);
        return ResponseEntity.ok(updated);
    }

    /**
     * Delete course (Owner if no students, Admin)
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("@tlmsAuthService.canDeleteCourse(#id)")
    public ResponseEntity<Void> deleteCourse(@PathVariable Long id) {
        courseService.deleteCourse(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Get course analytics (Owner, Admin)
     */
    @GetMapping("/{id}/analytics")
    @PreAuthorize("@tlmsAuthService.canAccessCourseAnalytics(#id)")
    public ResponseEntity<?> getCourseAnalytics(@PathVariable Long id) {
        return ResponseEntity.ok(courseService.getAnalytics(id));
    }

    /**
     * Enroll student in course
     */
    @PostMapping("/{courseId}/enroll/{studentId}")
    @PreAuthorize("@tlmsAuthService.canEnrollStudent(#courseId, #studentId)")
    public ResponseEntity<Void> enrollStudent(
            @PathVariable Long courseId,
            @PathVariable Long studentId) {
        
        courseService.enrollStudent(courseId, studentId);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    /**
     * Remove student from course (Instructor, Admin)
     */
    @DeleteMapping("/{courseId}/students/{studentId}")
    @PreAuthorize("@tlmsAuthService.canRemoveStudentFromCourse(#courseId, #studentId)")
    public ResponseEntity<Void> removeStudent(
            @PathVariable Long courseId,
            @PathVariable Long studentId) {
        
        courseService.removeStudent(courseId, studentId);
        return ResponseEntity.noContent().build();
    }

    // DTOs...
    @Data
    public static class CreateCourseRequest {
        private String title;
        private String description;
        private String category;
        private Boolean isPublic;
    }

    @Data
    public static class UpdateCourseRequest {
        private String title;
        private String description;
        private Boolean isPublic;
    }
}
```

### 2. Assignment Controller

```java
package com.jdnbrothers.tlms.controller;

import com.jdnbrothers.tlms.dto.AssignmentDTO;
import com.jdnbrothers.tlms.service.AssignmentService;
import com.jdnbrothers.tlms.service.security.TlmsAuthorizationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Assignment Management API
 * 
 * Authorization:
 * - GET /api/assignments/{id}: Owner, Enrolled, Admin
 * - POST /api/courses/{courseId}/assignments: Course Owner, Admin
 * - PUT /api/assignments/{id}: Course Owner, Admin (no submissions)
 * - DELETE /api/assignments/{id}: Course Owner, Admin
 * - POST /api/assignments/{id}/submit: Enrolled Student (deadline not passed)
 * - GET /api/assignments/{id}/submissions: Instructor (course), Admin
 */
@RestController
@RequestMapping("/api/assignments")
@RequiredArgsConstructor
public class AssignmentController {

    private final AssignmentService assignmentService;
    private final TlmsAuthorizationService authService;

    /**
     * Get assignment (if accessible)
     */
    @GetMapping("/{id}")
    @PreAuthorize("@tlmsAuthService.canViewAssignment(#id)")
    public ResponseEntity<AssignmentDTO> getAssignment(@PathVariable Long id) {
        return ResponseEntity.ok(assignmentService.getAssignment(id));
    }

    /**
     * Create assignment in course
     */
    @PostMapping("/course/{courseId}")
    @PreAuthorize("@tlmsAuthService.canCreateAssignment(#courseId)")
    public ResponseEntity<AssignmentDTO> createAssignment(
            @PathVariable Long courseId,
            @RequestBody CreateAssignmentRequest request) {
        
        AssignmentDTO assignment = assignmentService.createAssignment(courseId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(assignment);
    }

    /**
     * Update assignment (no submissions)
     */
    @PutMapping("/{id}")
    @PreAuthorize("@tlmsAuthService.canEditAssignment(#id)")
    public ResponseEntity<AssignmentDTO> updateAssignment(
            @PathVariable Long id,
            @RequestBody UpdateAssignmentRequest request) {
        
        AssignmentDTO updated = assignmentService.updateAssignment(id, request);
        return ResponseEntity.ok(updated);
    }

    /**
     * Delete assignment
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("@tlmsAuthService.canDeleteAssignment(#id)")
    public ResponseEntity<Void> deleteAssignment(@PathVariable Long id) {
        assignmentService.deleteAssignment(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Submit assignment (student)
     */
    @PostMapping("/{id}/submit")
    @PreAuthorize("@tlmsAuthService.canSubmitAssignment(#id)")
    public ResponseEntity<Void> submitAssignment(
            @PathVariable Long id,
            @RequestBody SubmitAssignmentRequest request) {
        
        assignmentService.submitAssignment(id, request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    /**
     * Get submissions (instructor/admin)
     */
    @GetMapping("/{id}/submissions")
    @PreAuthorize("@tlmsAuthService.canEditAssignment(#id)")
    public ResponseEntity<List<?>> getSubmissions(@PathVariable Long id) {
        return ResponseEntity.ok(assignmentService.getSubmissions(id));
    }

    // DTOs...
    @Data
    public static class CreateAssignmentRequest {
        private String title;
        private String description;
        private LocalDateTime dueDate;
        private Integer maxPoints;
    }
}
```

### 3. Grading Controller

```java
package com.jdnbrothers.tlms.controller;

import com.jdnbrothers.tlms.dto.GradeDTO;
import com.jdnbrothers.tlms.service.GradeService;
import com.jdnbrothers.tlms.service.security.TlmsAuthorizationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * Grading API
 * 
 * Authorization:
 * - GET /api/grades/student/{studentId}: Self, Instructor (enrolled), Admin
 * - POST /api/submissions/{submissionId}/grade: Instructor (course), Admin
 */
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class GradeController {

    private final GradeService gradeService;
    private final TlmsAuthorizationService authService;

    /**
     * Get student's grades (self, instructor in courses, admin)
     */
    @GetMapping("/grades/student/{studentId}")
    @PreAuthorize("@tlmsAuthService.canViewStudentGrades(#studentId)")
    public ResponseEntity<?> getStudentGrades(@PathVariable Long studentId) {
        return ResponseEntity.ok(gradeService.getStudentGrades(studentId));
    }

    /**
     * Grade a submission
     */
    @PostMapping("/submissions/{submissionId}/grade")
    @PreAuthorize("@tlmsAuthService.canGradeSubmission(#submissionId)")
    public ResponseEntity<GradeDTO> gradeSubmission(
            @PathVariable Long submissionId,
            @RequestBody GradeSubmissionRequest request) {
        
        GradeDTO grade = gradeService.gradeSubmission(submissionId, request);
        return ResponseEntity.ok(grade);
    }

    @Data
    public static class GradeSubmissionRequest {
        private Integer points;
        private String feedback;
    }
}
```

---

## Testing TLMS Authorization

```java
package com.jdnbrothers.tlms.controller;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@DisplayName("TLMS Authorization Tests")
class TlmsAuthorizationTest {

    @Autowired
    private MockMvc mockMvc;

    @Nested
    @DisplayName("Course Management Authorization")
    class CourseAuthorizationTest {

        @Test
        @DisplayName("Admin can view all courses")
        @WithMockUser(roles = "ADMIN")
        void testAdminCanViewAllCourses() throws Exception {
            mockMvc.perform(get("/api/courses"))
                .andExpect(status().isOk());
        }

        @Test
        @DisplayName("Instructor can create course")
        @WithMockUser(roles = "INSTRUCTOR")
        void testInstructorCanCreateCourse() throws Exception {
            mockMvc.perform(post("/api/courses")
                .contentType("application/json")
                .content("""
                    {
                        "title": "New Course",
                        "description": "Description",
                        "isPublic": true
                    }
                    """))
                .andExpect(status().isCreated());
        }

        @Test
        @DisplayName("Student cannot create course")
        @WithMockUser(roles = "STUDENT")
        void testStudentCannotCreateCourse() throws Exception {
            mockMvc.perform(post("/api/courses")
                .contentType("application/json")
                .content("""
                    {
                        "title": "New Course",
                        "description": "Description",
                        "isPublic": true
                    }
                    """))
                .andExpect(status().isForbidden());
        }

        @Test
        @DisplayName("Instructor can only edit own courses")
        @WithMockUser(username = "instructor1", roles = "INSTRUCTOR")
        void testInstructorCanEditOwnCourse() throws Exception {
            // Course owned by instructor1
            mockMvc.perform(put("/api/courses/1")
                .contentType("application/json")
                .content("""
                    {
                        "title": "Updated Title",
                        "description": "Updated Description",
                        "isPublic": true
                    }
                    """))
                .andExpect(status().isOk());
        }

        @Test
        @DisplayName("Instructor cannot edit others' courses")
        @WithMockUser(username = "instructor2", roles = "INSTRUCTOR")
        void testInstructorCannotEditOtherCourse() throws Exception {
            // Course owned by instructor1, not instructor2
            mockMvc.perform(put("/api/courses/1")
                .contentType("application/json")
                .content("""
                    {
                        "title": "Updated Title",
                        "description": "Updated Description",
                        "isPublic": true
                    }
                    """))
                .andExpect(status().isForbidden());
        }
    }

    @Nested
    @DisplayName("Assignment Management Authorization")
    class AssignmentAuthorizationTest {

        @Test
        @DisplayName("Student can submit assignment before deadline")
        @WithMockUser(roles = "STUDENT")
        void testStudentCanSubmitAssignment() throws Exception {
            mockMvc.perform(post("/api/assignments/1/submit")
                .contentType("application/json")
                .content("""
                    {
                        "content": "Student submission"
                    }
                    """))
                .andExpect(status().isCreated());
        }

        @Test
        @DisplayName("Instructor can view student submissions")
        @WithMockUser(roles = "INSTRUCTOR")
        void testInstructorCanViewSubmissions() throws Exception {
            // Assignment in instructor's course
            mockMvc.perform(get("/api/assignments/1/submissions"))
                .andExpect(status().isOk());
        }

        @Test
        @DisplayName("Student cannot view others' submissions")
        @WithMockUser(roles = "STUDENT")
        void testStudentCannotViewSubmissions() throws Exception {
            mockMvc.perform(get("/api/assignments/1/submissions"))
                .andExpect(status().isForbidden());
        }
    }

    @Nested
    @DisplayName("Grading Authorization")
    class GradingAuthorizationTest {

        @Test
        @DisplayName("Student can view own grades")
        @WithMockUser(username = "student1", roles = "STUDENT")
        void testStudentCanViewOwnGrades() throws Exception {
            // Assuming user ID 1 is student1
            mockMvc.perform(get("/api/grades/student/1"))
                .andExpect(status().isOk());
        }

        @Test
        @DisplayName("Student cannot view others' grades")
        @WithMockUser(username = "student1", roles = "STUDENT")
        void testStudentCannotViewOtherGrades() throws Exception {
            mockMvc.perform(get("/api/grades/student/2"))
                .andExpect(status().isForbidden());
        }

        @Test
        @DisplayName("Instructor can grade submissions in own course")
        @WithMockUser(roles = "INSTRUCTOR")
        void testInstructorCanGrade() throws Exception {
            mockMvc.perform(post("/api/submissions/1/grade")
                .contentType("application/json")
                .content("""
                    {
                        "points": 85,
                        "feedback": "Good work"
                    }
                    """))
                .andExpect(status().isOk());
        }
    }
}
```

---

## Best Practices for TLMS

1. **Always check ownership before revealing data**: Course owner, student enrollment, etc.
2. **Prevent data loss**: Only allow deletion if safe (no enrollments, submissions)
3. **Deadline enforcement**: Server-side validation for submission deadlines
4. **Audit trail**: Log grade changes, enrollment changes, course modifications
5. **Caching**: Cache course access lists for instructors with many courses
6. **Cascading permissions**: Child resource permissions inherit from parent course

---

This comprehensive example shows how to apply authorization concepts to a real-world learning management system.