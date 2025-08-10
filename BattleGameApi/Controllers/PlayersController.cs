using BattleGameApi.Data;
using BattleGameApi.Dtos;
using BattleGameApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BattleGameApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PlayersController : ControllerBase
    {
        private readonly AppDbContext _db;
        public PlayersController(AppDbContext db) => _db = db;

        // GET: api/players
        [HttpGet]
        public async Task<IActionResult> GetPlayers()
        {
            var players = await _db.Players
                .Include(p => p.PlayerAssets)
                .ThenInclude(pa => pa.Asset)
                .ToListAsync();

            var result = players.Select(p => new PlayerDto
            {
                PlayerId = p.PlayerId,
                PlayerName = p.PlayerName,
                FullName = p.FullName,
                Age = p.Age,
                Level = p.Level,
                AssetNames = p.PlayerAssets.Select(pa => pa.Asset.AssetName).ToList(),
                AssetIds = p.PlayerAssets.Select(pa => pa.AssetId).ToList()
            });

            return Ok(result);
        }

        // GET: api/players/{id}
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetPlayer(int id)
        {
            var p = await _db.Players
                .Include(pl => pl.PlayerAssets)
                .ThenInclude(pa => pa.Asset)
                .FirstOrDefaultAsync(pl => pl.PlayerId == id);

            if (p == null) return NotFound();

            var dto = new PlayerDto
            {
                PlayerId = p.PlayerId,
                PlayerName = p.PlayerName,
                FullName = p.FullName,
                Age = p.Age,
                Level = p.Level,
                AssetNames = p.PlayerAssets.Select(pa => pa.Asset.AssetName).ToList(),
                AssetIds = p.PlayerAssets.Select(pa => pa.AssetId).ToList()
            };

            return Ok(dto);
        }

        // POST: api/players
        [HttpPost]
        public async Task<IActionResult> Create(PlayerDto input)
        {
            // if (!ModelState.IsValid) return BadRequest(ModelState);

            // var player = new Player
            // {
            //     PlayerName = input.PlayerName,
            //     FullName = input.FullName,
            //     Age = input.Age,
            //     Level = input.Level
            // };

            // // Gán asset mới nếu đủ level
            // if (input.AssetIds != null && input.AssetIds.Any())
            // {
            //     var assets = await _db.Assets
            //         .Where(a => input.AssetIds.Contains(a.AssetId))
            //         .ToListAsync();

            //     foreach (var asset in assets)
            //     {
            //         if (player.Level >= asset.LevelRequired)
            //         {
            //             player.PlayerAssets.Add(new PlayerAsset
            //             {
            //                 Player = player,
            //                 AssetId = asset.AssetId
            //             });
            //         }
            //         else
            //         {
            //             return BadRequest($"Player level {player.Level} is lower than required level {asset.LevelRequired} for asset '{asset.AssetName}'.");
            //         }
            //     }
            // }

            // _db.Players.Add(player);
            // await _db.SaveChangesAsync();
            // return CreatedAtAction(nameof(GetPlayer), new { id = player.PlayerId }, player);
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                // Validate required fields
                if (string.IsNullOrEmpty(input.PlayerName))
                    return BadRequest("PlayerName is required");

                if (input.Level <= 0)
                    return BadRequest("Level must be greater than 0");

                var player = new Player
                {
                    PlayerName = input.PlayerName,
                    FullName = input.FullName,
                    Age = input.Age,
                    Level = input.Level
                };

                if (input.AssetIds != null && input.AssetIds.Any())
                {
                    var assets = await _db.Assets
                        .Where(a => input.AssetIds.Contains(a.AssetId))
                        .ToListAsync();

                    foreach (var asset in assets)
                    {
                        if (player.Level >= asset.LevelRequired)
                        {
                            player.PlayerAssets.Add(new PlayerAsset
                            {
                                Player = player,
                                AssetId = asset.AssetId
                            });
                        }
                        else
                        {
                            return BadRequest($"Player level {player.Level} is lower than required level {asset.LevelRequired} for asset '{asset.AssetName}'.");
                        }
                    }
                }

                _db.Players.Add(player);
                await _db.SaveChangesAsync();

                // Return the created player with assets
                var createdPlayer = await _db.Players
                    .Include(p => p.PlayerAssets)
                    .ThenInclude(pa => pa.Asset)
                    .FirstOrDefaultAsync(p => p.PlayerId == player.PlayerId);

                return CreatedAtAction(nameof(GetPlayer), new { id = player.PlayerId }, createdPlayer);
            }
            catch (Exception ex)
            {
                // Log the error
                Console.WriteLine($"Error creating player: {ex}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // PUT: api/players/{id}
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, PlayerDto input)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var player = await _db.Players
                .Include(p => p.PlayerAssets)
                .FirstOrDefaultAsync(p => p.PlayerId == id);

            if (player == null) return NotFound();

            player.PlayerName = input.PlayerName;
            player.FullName = input.FullName;
            player.Age = input.Age;
            player.Level = input.Level;

            // Danh sách asset hiện có
            var currentAssetIds = player.PlayerAssets.Select(pa => pa.AssetId).ToList();

            // Danh sách asset mới được chọn từ input
            var newAssetIds = input.AssetIds ?? new List<int>();

            // Xóa asset không còn trong danh sách mới
            var toRemove = player.PlayerAssets.Where(pa => !newAssetIds.Contains(pa.AssetId)).ToList();
            foreach (var rem in toRemove)
            {
                _db.PlayerAssets.Remove(rem);
            }

            // Thêm asset mới mà player chưa có
            var toAddIds = newAssetIds.Except(currentAssetIds).ToList();
            if (toAddIds.Any())
            {
                var assetsToAdd = await _db.Assets
                    .Where(a => toAddIds.Contains(a.AssetId))
                    .ToListAsync();

                foreach (var asset in assetsToAdd)
                {
                    if (player.Level >= asset.LevelRequired)
                    {
                        player.PlayerAssets.Add(new PlayerAsset
                        {
                            PlayerId = player.PlayerId,
                            AssetId = asset.AssetId
                        });
                    }
                    else
                    {
                        return BadRequest($"Player level {player.Level} is lower than required level {asset.LevelRequired} for asset '{asset.AssetName}'.");
                    }
                }
            }

            await _db.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/players/{id}
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var player = await _db.Players.FindAsync(id);
            if (player == null) return NotFound();

            _db.Players.Remove(player);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}
