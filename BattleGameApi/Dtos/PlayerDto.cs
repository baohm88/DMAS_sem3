using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BattleGameApi.Dtos
{
    public class PlayerDto
    {
        public int PlayerId { get; set; }
        public string PlayerName { get; set; } = null!;
        public string? FullName { get; set; }
        [Range(0, 150)]
        public int Age { get; set; }
        [Required]
        [Range(0, 10)]
        public int Level { get; set; }
        public List<int> AssetIds { get; set; } = new List<int>();
        public List<string> AssetNames { get; set; } = new List<string>();
    }
}