namespace BattleGameApi.Models
{
    public class PlayerAsset
    {
        public int PlayerAssetId { get; set; }

        public int PlayerId { get; set; }
        public Player Player { get; set; } = null!;

        public int AssetId { get; set; }
        public Asset Asset { get; set; } = null!;
    }
}

