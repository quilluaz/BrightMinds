package JIZAS.BrightMinds.dto;

public class UserViewDTO {
    private Long userId;
    private String fName;
    private String lName;
    private String username;

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getFName() { return fName; }
    public void setFName(String fName) { this.fName = fName; }
    public String getLName() { return lName; }
    public void setLName(String lName) { this.lName = lName; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
}
