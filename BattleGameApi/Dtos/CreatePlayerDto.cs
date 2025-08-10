namespace BattleGameApi.Dtos
{
    public class CreatePlayerDto
    {
        public string PlayerName { get; set; } = null!;
        public string? FullName { get; set; }
        public int Age { get; set; }
        public int Level { get; set; }
        public List<int> AssetIds { get; set; } = new();
    }
}
