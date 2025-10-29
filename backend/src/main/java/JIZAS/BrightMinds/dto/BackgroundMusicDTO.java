package JIZAS.BrightMinds.dto;

public class BackgroundMusicDTO {
    private String filePath;
    private Integer volume;

    public BackgroundMusicDTO() {}

    public BackgroundMusicDTO(String filePath, Integer volume) {
        this.filePath = filePath;
        this.volume = volume;
    }

    public String getFilePath() { return filePath; }
    public void setFilePath(String filePath) { this.filePath = filePath; }
    
    public Integer getVolume() { return volume; }
    public void setVolume(Integer volume) { this.volume = volume; }
}
