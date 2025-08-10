using System.Collections.Generic;

namespace BattleGameApi.Dtos
{
    public class PlayerDto
    {
        public int PlayerId { get; set; }
        public string PlayerName { get; set; } = null!;
        public string? FullName { get; set; }
        public int Age { get; set; }
        public int Level { get; set; }
        public List<string> AssetNames { get; set; } = new();
        public List<int> AssetIds { get; set; } = new();
    }
}

// using System.Collections.Generic;

// namespace BattleGameApi.Dtos
// {
//     public class PlayerDto
//     {
//         public int PlayerId { get; set; }
//         public string PlayerName { get; set; } = null!;
//         public string? FullName { get; set; }
//         public int Age { get; set; }
//         public int Level { get; set; }

//         // Danh sách tên asset (để hiển thị)
//         public List<string> AssetNames { get; set; } = new();

//         // Danh sách ID asset (để CRUD)
//         public List<int> AssetIds { get; set; } = new();
//     }
// }
