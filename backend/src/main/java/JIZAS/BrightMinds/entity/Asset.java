package JIZAS.BrightMinds.entity;

import jakarta.persistence.*;
import java.util.Map;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "asset")
public class Asset {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "asset_id")
	private Long assetId;

	@Column(name = "name", length = 100)
	private String name;

	@Column(name = "type")
	private String type; // image, audio, video, etc.

	@Column(name = "file_path", columnDefinition = "TEXT")
	private String filePath;

    @Column(name = "metadata", columnDefinition = "jsonb")
    @JdbcTypeCode(SqlTypes.JSON)
    private Map<String, Object> metadata; // stored as JSONB in PostgreSQL

	public Long getAssetId() { return assetId; }
	public void setAssetId(Long assetId) { this.assetId = assetId; }

	public String getName() { return name; }
	public void setName(String name) { this.name = name; }

	public String getType() { return type; }
	public void setType(String type) { this.type = type; }

	public String getFilePath() { return filePath; }
	public void setFilePath(String filePath) { this.filePath = filePath; }

    public Map<String, Object> getMetadata() { return metadata; }
    public void setMetadata(Map<String, Object> metadata) { this.metadata = metadata; }
}


