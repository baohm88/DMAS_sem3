using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BattleGameApi.Models
{
    public class Player
    {
        public int PlayerId { get; set; }

        [Required]
        [MaxLength(100)]
        public string PlayerName { get; set; } = null!;

        [MaxLength(150)]
        public string? FullName { get; set; }

        [Range(0, 150)]
        public int Age { get; set; }

        [Required]
        [Range(0, 10)]
        public int Level { get; set; }

        public ICollection<PlayerAsset> PlayerAssets { get; set; } = new List<PlayerAsset>();
    }
}
