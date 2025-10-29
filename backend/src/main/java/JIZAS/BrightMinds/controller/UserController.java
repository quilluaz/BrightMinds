package JIZAS.BrightMinds.controller;

import JIZAS.BrightMinds.dto.UserCreationDTO;
import JIZAS.BrightMinds.dto.UserUpdateDTO; // New import, was UserRequestDTO
import JIZAS.BrightMinds.dto.UserViewDTO;
import JIZAS.BrightMinds.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@Tag(name = "User Management", description = "APIs for managing users in the BrightMinds system")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping
    @Operation(summary = "Create a new user", description = "Creates a new user account with the provided information")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "User created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input data or email already exists")
    })
    public ResponseEntity<UserViewDTO> createUser(@Valid @RequestBody UserCreationDTO userRequest) {
        try {
            UserViewDTO createdUser = userService.create(userRequest);
            return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping
    @Operation(summary = "Get all users", description = "Retrieves a list of all users in the system")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved list of users")
    public ResponseEntity<List<UserViewDTO>> getAllUsers() {
        try {
            List<UserViewDTO> users = userService.list();
            return new ResponseEntity<>(users, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{userId}")
    @Operation(summary = "Get user by ID", description = "Retrieves a specific user by their unique identifier")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User found successfully"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    public ResponseEntity<UserViewDTO> getUserById(@Parameter(description = "User ID") @PathVariable Long userId) {
        try {
            UserViewDTO user = userService.get(userId);
            if (user != null) {
                return new ResponseEntity<>(user, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{userId}")
    public ResponseEntity<UserViewDTO> updateUser(@PathVariable Long userId, @Valid @RequestBody UserUpdateDTO userRequest) {
        try {
            UserViewDTO updatedUser = userService.update(userId, userRequest);
            if (updatedUser != null) {
                return new ResponseEntity<>(updatedUser, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long userId) {
        try {
            userService.delete(userId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<UserViewDTO> getUserByEmail(@PathVariable String email) {
        try {
            UserViewDTO user = userService.getByEmail(email);
            if (user != null) {
                return new ResponseEntity<>(user, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/me/password")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, String>> changePassword(@RequestBody Map<String, String> passwordData) {
        try {
            String newPassword = passwordData.get("password");
            if (newPassword == null || newPassword.trim().isEmpty()) {
                return new ResponseEntity<>(Map.of("error", "Password is required"), HttpStatus.BAD_REQUEST);
            }
            
            // TODO: Get current user from JWT token when authentication is implemented
            // For now, we'll need to get user ID from request header or implement proper JWT extraction
            Long userId = 1L; // Placeholder - should be extracted from JWT token
            
            userService.changePassword(userId, newPassword);
            return new ResponseEntity<>(Map.of("message", "Password changed successfully"), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(Map.of("error", "Failed to change password"), HttpStatus.BAD_REQUEST);
        }
    }
}