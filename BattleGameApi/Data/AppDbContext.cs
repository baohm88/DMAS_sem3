using BattleGameApi.Models;
using Microsoft.EntityFrameworkCore;

namespace BattleGameApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Player> Players { get; set; } = null!;
        public DbSet<Asset> Assets { get; set; } = null!;
        public DbSet<PlayerAsset> PlayerAssets { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Player>()
                .HasKey(p => p.PlayerId);

            modelBuilder.Entity<Asset>()
                .HasKey(a => a.AssetId);

            modelBuilder.Entity<PlayerAsset>()
                .HasKey(pa => pa.PlayerAssetId);

            modelBuilder.Entity<PlayerAsset>()
                .HasOne(pa => pa.Player)
                .WithMany(p => p.PlayerAssets)
                .HasForeignKey(pa => pa.PlayerId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<PlayerAsset>()
                .HasOne(pa => pa.Asset)
                .WithMany(a => a.PlayerAssets)
                .HasForeignKey(pa => pa.AssetId)
                .OnDelete(DeleteBehavior.Cascade);

            // Seed sample data
            modelBuilder.Entity<Asset>().HasData(
                new Asset { AssetId = 1, AssetName = "Hero 1" },
                new Asset { AssetId = 2, AssetName = "Hero 2" }
            );

            modelBuilder.Entity<Player>().HasData(
                new Player { PlayerId = 1, PlayerName = "Player 1", FullName = "Player One", Age = 20, Level = 10 },
                new Player { PlayerId = 2, PlayerName = "Player 2", FullName = "Player Two", Age = 19, Level = 3 },
                new Player { PlayerId = 3, PlayerName = "Player 3", FullName = "Player Three", Age = 23, Level = 10 }
            );

            modelBuilder.Entity<PlayerAsset>().HasData(
                new PlayerAsset { PlayerAssetId = 1, PlayerId = 1, AssetId = 1 },
                new PlayerAsset { PlayerAssetId = 2, PlayerId = 2, AssetId = 2 },
                new PlayerAsset { PlayerAssetId = 3, PlayerId = 3, AssetId = 1 }
            );
        }
    }
}
