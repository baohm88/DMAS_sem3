using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BattleGameApi.Models
{
    public class Asset
    {
        public int AssetId { get; set; }

        [Required]
        [MaxLength(150)]
        public string AssetName { get; set; } = null!;

        [Range(1, int.MaxValue, ErrorMessage = "LevelRequired must be >= 1")]
        public int LevelRequired { get; set; }

        public ICollection<PlayerAsset> PlayerAssets { get; set; } = new List<PlayerAsset>();
    }
}
