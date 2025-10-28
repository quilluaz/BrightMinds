package JIZAS.BrightMinds.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import JIZAS.BrightMinds.entity.User;

public class UserViewDTO {
    private Long userId;
    @JsonProperty("firstName")
    private String fName;
    @JsonProperty("lastName")
    private String lName;
    private String email;
    private String token; // Optional field for authentication responses
    private String role;

    public UserViewDTO() {}

    public UserViewDTO(Long userId, String fName, String lName, String email) {
        this.userId = userId;
        this.fName = fName;
        this.lName = lName;
        this.email = email;
    }

    public UserViewDTO(Long userId, String fName, String lName, String email, String token) {
        this.userId = userId;
        this.fName = fName;
        this.lName = lName;
        this.email = email;
        this.token = token;
    }

    public UserViewDTO(Long userId, String fName, String lName, String email, String token, User.Role role) {
        this.userId = userId;
        this.fName = fName;
        this.lName = lName;
        this.email = email;
        this.token = token;
        this.role = role.name();
    }


    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getFName() { return fName; }
    public void setFName(String fName) { this.fName = fName; }
    public String getLName() { return lName; }
    public void setLName(String lName) { this.lName = lName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}