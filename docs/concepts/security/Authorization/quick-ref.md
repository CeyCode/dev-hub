---
title: "Authorization Quick Reference & Decision Tree"
sidebar_label: "Quick Reference"
sidebar_position: 9
description: "Fast lookup guide for common authorization patterns and decision flowchart for choosing the right authorization approach."
tags: [spring-boot, security, authorization, quick-reference]
---

# Authorization Quick Reference & Decision Tree

## 1. Decision Flowchart

```
┌─────────────────────────────────┐
│   What endpoint are you securing? │
└────────────┬────────────────────┘
             │
             ▼
     ┌──────────────────────┐
     │ Does everyone need   │
     │ to access it?        │
     └────┬───────────┬─────┘
          │YES        │NO
          │           │
          ▼           ▼
    ┌────────────┐  ┌──────────────────────┐
    │ @None      │  │ Do all authenticated │
    │ permitAll  │  │ users need access?   │
    └────────────┘  └────┬────────────┬────┘
                         │YES         │NO
                         │            │
                         ▼            ▼
                   ┌────────────┐  ┌──────────────────────┐
                   │@PreAuthorize│  │ Is this role-based   │
                   │isAuthentic- │  │ (ADMIN, USER, etc)?  │
                   │ated()       │  └────┬────────────┬────┘
                   └────────────┘       │YES         │NO
                                        │            │
                                        ▼            ▼
                                   ┌────────────┐  ┌──────────────────────┐
                                   │@PreAuthorize│  │ Is this ownership-   │
                                   │hasRole()    │  │ based (my data)?     │
                                   │or hasAnyRole│  └────┬────────────┬────┘
                                   │()           │       │YES         │NO
                                   └────────────┘       │            │
                                                        ▼            ▼
                                                   ┌──────────────┐ ┌───────────────┐
                                                   │@PreAuthorize │ │@PreAuthorize  │
                                                   │@authService. │ │@authService.  │
                                                   │isCurrentUser │ │canAccess()    │
                                                   │()            │ │(complex logic)│
                                                   └──────────────┘ └───────────────┘
```

---

## 2. Authorization Pattern Selector

Find your use case and copy the pattern:

### Public Endpoint
```java
@GetMapping("/login-page")
// No @PreAuthorize needed
public ResponseEntity<?> getLoginPage() { }
```

### Any Authenticated User
```java
@GetMapping("/profile")
@PreAuthorize("isAuthenticated()")
public ResponseEntity<?> getProfile() { }
```

### Specific Role (Single)
```java
@GetMapping("/admin/dashboard")
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<?> adminDashboard() { }
```

### Specific Roles (Multiple - ANY)
```java
@GetMapping("/reports")
@PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
public ResponseEntity<?> getReports() { }
```

### Specific Roles (Multiple - ALL)
```java
@GetMapping("/sensitive-audit")
@PreAuthorize("hasAllRoles('ADMIN', 'AUDITOR')")
public ResponseEntity<?> auditLog() { }
```

### Own Data (Ownership)
```java
@GetMapping("/{id}")
@PreAuthorize("@authService.isCurrentUser(#id)")
public ResponseEntity<?> getProfile(@PathVariable Long id) { }
```

### Own Data OR Admin
```java
@GetMapping("/{id}")
@PreAuthorize("@authService.isAdminOrOwner(#id)")
public ResponseEntity<?> getProfile(@PathVariable Long id) { }
```

### Complex Business Logic
```java
@PostMapping("/{id}/delete")
@PreAuthorize("@authService.canDeleteResource(#id)")
public ResponseEntity<?> deleteResource(@PathVariable Long id) { }

// In AuthorizationService:
public boolean canDeleteResource(Long resourceId) {
    // Your complex logic here
    return isAdmin() || (isOwner(resourceId) && isNotArchived(resourceId));
}
```

---

## 3. Common Endpoints Security Matrix

| Endpoint | Public | Authenticated | ADMIN | MANAGER | USER | Owner | Pattern |
|----------|--------|---|---|---|---|---|---|
| `POST /auth/login` | ✅ | | | | | | permitAll |
| `GET /api/users` | | | ✅ | | | | hasRole(ADMIN) |
| `GET /api/users/{id}` | | | ✅ | | | ✅ | isAdminOrOwner |
| `PUT /api/users/{id}` | | | ✅ | | | ✅ | isAdminOrOwner |
| `DELETE /api/users/{id}` | | | ✅ | | | | hasRole(ADMIN) |
| `GET /api/profile` | | ✅ | ✅ | ✅ | ✅ | | isAuthenticated |
| `PUT /api/profile` | | ✅ | ✅ | ✅ | ✅ | | isAuthenticated |
| `GET /api/reports` | | | ✅ | ✅ | | | hasAnyRole(ADMIN,MANAGER) |
| `POST /api/documents` | | ✅ | ✅ | ✅ | ✅ | | isAuthenticated |
| `GET /api/documents/{id}` | | | | | | ✅ | canViewDocument |
| `DELETE /api/documents/{id}` | | | | | | ✅ | canDeleteDocument |

---

## 4. Service Method Naming Conventions

Adopt these naming conventions for clarity:

```
is{Role}()              → isAdmin(), isManager(), isUser()
is{State}()             → isCurrentUser(), isAccountActive()
can{Action}{Resource}() → canEditUser(), canDeleteDocument()
has{Permission}()       → hasPermission(), hasAccess()
```

**Examples**:

```java
// ✅ Good naming
@authService.isAdmin()
@authService.isCurrentUser(#id)
@authService.canEditDocument(#docId)
@authService.canShareResource(#resourceId)
@authService.hasPermission('DELETE_USER')

// ❌ Poor naming
@authService.check(#id)              // Too vague
@authService.verify(#id)             // Unclear what we're verifying
@authService.access(#id)             // Is it checking or granting?
```

---

## 5. @PreAuthorize Expression Cheat Sheet

```java
// ===== Single Condition =====
@PreAuthorize("hasRole('ADMIN')")                    // Has ADMIN role
@PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")      // Has either role
@PreAuthorize("isAuthenticated()")                   // User is logged in
@PreAuthorize("isAnonymous()")                       // User is not logged in

// ===== Combine Conditions with AND =====
@PreAuthorize("hasRole('ADMIN') and isAuthenticated()")    // Both must be true
@PreAuthorize("hasRole('MANAGER') and #id != null")        // Role + param check

// ===== Combine Conditions with OR =====
@PreAuthorize("hasRole('ADMIN') or @auth.isCurrentUser(#id)")    // Either true
@PreAuthorize("isAnonymous() or isAuthenticated()")               // Always true

// ===== Negate Condition =====
@PreAuthorize("!hasRole('GUEST')")                          // Does NOT have GUEST
@PreAuthorize("!isAnonymous()")                             // Is NOT anonymous

// ===== Access Method Parameters =====
@PreAuthorize("@auth.isCurrentUser(#userId)")               // Method param
@PreAuthorize("#id == authentication.principal.id")         // Compare param to principal
@PreAuthorize("#req.ownerId == authentication.principal.id")  // Request body field

// ===== Access Authentication Details =====
@PreAuthorize("authentication.principal.email == 'admin@example.com'")
@PreAuthorize("authentication.name == 'john.doe'")
@PreAuthorize("authentication.authorities.stream().anyMatch(a -> a.authority == 'ROLE_ADMIN')")

// ===== Call Service Methods =====
@PreAuthorize("@authService.isAdmin()")                     // Simple check
@PreAuthorize("@authService.canEdit(#id)")                  // With param
@PreAuthorize("@userService.isActive(#userId)")             // Different service
@PreAuthorize("@authService.hasPermission('EDIT_USER')")    // Permission check

// ===== Complex Expressions =====
@PreAuthorize("hasRole('ADMIN') or (@authService.isOwner(#id) and #status == 'DRAFT')")
@PreAuthorize("(hasRole('ADMIN') or hasRole('MANAGER')) and @audit.canAccess(#resourceId)")
@PreAuthorize("@auth.isCurrentUser(#id) or (hasRole('ADMIN') and !@user.isOnlyAdmin(#id))")
```

---

## 6. Error Responses Quick Reference

| HTTP Status | Meaning | Spring Security Class | When It Occurs |
|---|---|---|---|
| 401 Unauthorized | Not authenticated (no token/invalid token) | `AuthenticationException` | User not logged in or token expired |
| 403 Forbidden | Authenticated but lacks permission | `AccessDeniedException` | User logged in but @PreAuthorize fails |

**Example Response Bodies**:

```json
// 401 Unauthorized
{
  "status": 401,
  "error": "UNAUTHORIZED",
  "message": "Authentication required. Please log in.",
  "timestamp": "2024-01-15T10:30:00Z"
}

// 403 Forbidden
{
  "status": 403,
  "error": "FORBIDDEN",
  "message": "You don't have permission to access this resource",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

## 7. Testing Authorization - Quick Commands

### Unit Test Template

```java
@Test
@WithMockUser(username = "admin", roles = "ADMIN")
void testAdminCanDelete() throws Exception {
    mockMvc.perform(delete("/api/users/1"))
        .andExpect(status().isNoContent());
}

@Test
@WithMockUser(username = "user", roles = "USER")
void testUserCannotDelete() throws Exception {
    mockMvc.perform(delete("/api/users/1"))
        .andExpect(status().isForbidden());
}

@Test
void testUnauthenticatedCannotDelete() throws Exception {
    mockMvc.perform(delete("/api/users/1"))
        .andExpect(status().isUnauthorized());
}
```

### Running Tests

```bash
# Run all authorization tests
mvn test -Dtest=*Authorization*

# Run specific test class
mvn test -Dtest=UserControllerAuthorizationTest

# Run with coverage
mvn test jacoco:report

# Run specific test method
mvn test -Dtest=UserControllerAuthorizationTest#testAdminCanDelete
```

---

## 8. Debugging Authorization Issues

### Check 1: Verify @EnableMethodSecurity is Present

```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)  // ← MUST BE HERE
public class SecurityConfig { }
```

### Check 2: Verify UserPrincipal is Returned

```java
// UserDetailsService must return UserPrincipal (or custom UserDetails)
@Override
public UserDetails loadUserByUsername(String username) {
    return UserPrincipal.builder()  // ← Not User
        .id(user.getId())
        .username(user.getUsername())
        .roleNames(roles)
        .build();
}
```

### Check 3: Verify AuthorizationService is @Service

```java
@Service  // ← MUST BE HERE for @authService to work
@RequiredArgsConstructor
public class AuthorizationService {
    // ...
}
```

### Check 4: Enable Debug Logging

```properties
# application.properties
logging.level.org.springframework.security=DEBUG
logging.level.com.jdnbrothers.tlms.service.security=DEBUG
```

### Check 5: Test with curl

```bash
# Test without token (401 expected)
curl -i http://localhost:8080/api/users

# Test with token but wrong role (403 expected)
curl -i -H "Authorization: Bearer <token>" http://localhost:8080/api/admin/users

# Test with token and correct role (200 expected)
curl -i -H "Authorization: Bearer <token>" http://localhost:8080/api/users/1
```

---

## 9. Common Mistakes & Solutions

| Mistake | Symptom | Solution |
|---------|---------|----------|
| No `@EnableMethodSecurity` | All `@PreAuthorize` ignored | Add `@EnableMethodSecurity(prePostEnabled=true)` to config |
| Wrong role prefix | `hasRole('ADMIN')` doesn't match `ROLE_ADMIN` | Return authorities as `ROLE_ADMIN` from `UserDetails.getAuthorities()` |
| `AuthorizationService` not `@Service` | "Unknown bean 'authService'" error | Add `@Service` annotation to class |
| Using string "ROLE_" | `hasRole('ROLE_ADMIN')` | Don't include "ROLE_" in hasRole(); it's added automatically |
| Forgetting `#paramName` | `#id` not recognized in expression | Prefix parameter references with `#` in `@PreAuthorize` |
| Calling static method | `@StaticUtil.check(#id)` fails | Use `@Service` beans only, not static utilities |
| Complex logic in `@PreAuthorize` | Expression becomes unreadable | Extract to `AuthorizationService` method |
| No `@Transactional` | Lazy-loaded fields null in service | Add `@Transactional(readOnly=true)` to method if accessing lazy fields |

---

## 10. Performance Checklist

- [ ] Authorization service methods are fast (no N+1 queries)
- [ ] Expensive checks are `@Cacheable`
- [ ] Cache is invalidated when permissions change
- [ ] JWT principal includes all needed info (no extra DB lookups)
- [ ] No synchronous calls to other services in authorization
- [ ] Role/permission data is pre-loaded in `UserDetailsService`

---

## 11. Security Checklist Before Production

- [ ] All endpoints have explicit authorization rules
- [ ] No endpoint relies on frontend-only validation
- [ ] Admin cannot accidentally remove own admin role
- [ ] Users cannot view/edit others' data (except admins)
- [ ] Authorization failures are logged
- [ ] Sensitive URLs don't leak info in error messages
- [ ] JWT has reasonable expiry time (15-60 mins)
- [ ] CORS doesn't allow all origins (`*`)
- [ ] CSRF protection enabled (if using sessions)
- [ ] Rate limiting on login endpoint
- [ ] All authorization tests passing (>80% coverage)

---

## 12. Roles & Permissions Template

### Common Roles

```java
// Application roles
ADMIN       // Full system access, can manage users/roles/settings
MANAGER     // Can manage team members and view reports
INSTRUCTOR  // Can create and manage courses
STUDENT     // Can enroll and take courses
USER        // Basic authenticated user
GUEST       // Limited access, read-only
```

### Permission Examples

```java
// CRUD permissions
CREATE_USER
READ_USER
UPDATE_USER
DELETE_USER

// Feature permissions
MANAGE_COURSES
MANAGE_STUDENTS
VIEW_REPORTS
EXPORT_DATA
MANAGE_ROLES
VIEW_AUDIT_LOG

// Fine-grained permissions
EDIT_OWN_PROFILE
EDIT_ANY_PROFILE
DELETE_OWN_ACCOUNT
DELETE_ANY_ACCOUNT
```

---

## 13. Migration Guide: URL-Based to Method-Based

### Before (URL-based only)

```java
.authorizeHttpRequests(auth -> auth
    .requestMatchers("/api/admin/**").hasRole("ADMIN")
    .requestMatchers("/api/users/**").authenticated()
    .anyRequest().permitAll())
```

### After (Hybrid - Recommended)

```java
// URL-based (coarse rules)
.authorizeHttpRequests(auth -> auth
    .requestMatchers("/api/public/**").permitAll()
    .anyRequest().authenticated())

// Method-based (fine-grained)
@GetMapping("/api/users")
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<?> getAll() { }

@GetMapping("/api/users/{id}")
@PreAuthorize("@authService.canViewUser(#id)")
public ResponseEntity<?> getUser(@PathVariable Long id) { }
```

---

## 14. Reference: SpEL Built-in Functions

| Function | Returns | Example |
|----------|---------|---------|
| `hasRole()` | boolean | `hasRole('ADMIN')` |
| `hasAnyRole()` | boolean | `hasAnyRole('ADMIN', 'MANAGER')` |
| `isAuthenticated()` | boolean | `isAuthenticated()` |
| `isAnonymous()` | boolean | `isAnonymous()` |
| `isFullyAuthenticated()` | boolean | `isFullyAuthenticated()` |
| `principal` | UserPrincipal | `principal.id` |
| `authentication` | Authentication | `authentication.name` |
| `returnObject` | Return value | `returnObject.ownerId` (in @PostAuthorize) |

---

## 15. Resources & Links

- [Spring Security Authorization](https://docs.spring.io/spring-security/reference/servlet/authorization/index.html)
- [Method Security](https://docs.spring.io/spring-security/reference/servlet/authorization/method-security.html)
- [SpEL in Authorization](https://docs.spring.io/spring-security/reference/servlet/authorization/expression-based-access-control.html)
- [OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)

---

**Quick Tips**:
- Start with URL-level rules, add method-level for complex checks
- Every endpoint should have explicit authorization
- Test authorization with multiple user roles
- Cache expensive checks
- Log authorization failures
- Fail secure (deny by default)