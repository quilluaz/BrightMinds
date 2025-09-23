package JIZAS.BrightMinds.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "scene_asset")
public class SceneAsset {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "scene_asset_id")
	private Long sceneAssetId;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "scene_id", nullable = false)
	private Scene scene;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "asset_id", nullable = false)
	private Asset asset;

	@Column(name = "position_x")
	private Float positionX;

	@Column(name = "position_y")
	private Float positionY;

	@Column(name = "is_interactive")
	private Boolean isInteractive;

	@Column(name = "order_index")
	private Integer orderIndex;

	public Long getSceneAssetId() { return sceneAssetId; }
	public void setSceneAssetId(Long sceneAssetId) { this.sceneAssetId = sceneAssetId; }

	public Scene getScene() { return scene; }
	public void setScene(Scene scene) { this.scene = scene; }

	public Asset getAsset() { return asset; }
	public void setAsset(Asset asset) { this.asset = asset; }

	public Float getPositionX() { return positionX; }
	public void setPositionX(Float positionX) { this.positionX = positionX; }

	public Float getPositionY() { return positionY; }
	public void setPositionY(Float positionY) { this.positionY = positionY; }

	public Boolean getIsInteractive() { return isInteractive; }
	public void setIsInteractive(Boolean isInteractive) { this.isInteractive = isInteractive; }

	public Integer getOrderIndex() { return orderIndex; }
	public void setOrderIndex(Integer orderIndex) { this.orderIndex = orderIndex; }
}


