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

                // Reload the player with assets to get the latest data
                var createdPlayer = await _db.Players
                    .Include(p => p.PlayerAssets)
                    .ThenInclude(pa => pa.Asset)
                    .FirstOrDefaultAsync(p => p.PlayerId == player.PlayerId);

                // Convert to DTO
                var createdPlayerDto = new PlayerDto
                {
                    PlayerId = createdPlayer.PlayerId,
                    PlayerName = createdPlayer.PlayerName,
                    FullName = createdPlayer.FullName,
                    Age = createdPlayer.Age,
                    Level = createdPlayer.Level,
                    AssetNames = createdPlayer.PlayerAssets.Select(pa => pa.Asset?.AssetName).ToList(),
                    AssetIds = createdPlayer.PlayerAssets.Select(pa => pa.AssetId).ToList()
                };

                return CreatedAtAction(nameof(GetPlayer), new { id = player.PlayerId }, createdPlayerDto);
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
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var player = await _db.Players
                    .Include(p => p.PlayerAssets)
                    .ThenInclude(pa => pa.Asset)
                    .FirstOrDefaultAsync(p => p.PlayerId == id);

                if (player == null)
                    return NotFound();

                // Update basic info
                player.PlayerName = input.PlayerName;
                player.FullName = input.FullName;
                player.Age = input.Age;
                player.Level = input.Level;

                // Handle assets
                var currentAssetIds = player.PlayerAssets.Select(pa => pa.AssetId).ToList();
                var newAssetIds = input.AssetIds ?? new List<int>();

                // Remove assets no longer selected
                var toRemove = player.PlayerAssets.Where(pa => !newAssetIds.Contains(pa.AssetId)).ToList();
                foreach (var rem in toRemove)
                {
                    _db.PlayerAssets.Remove(rem);
                }

                // Add new assets
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

                // Return DTO instead of entity
                var updatedPlayerDto = new PlayerDto
                {
                    PlayerId = player.PlayerId,
                    PlayerName = player.PlayerName,
                    FullName = player.FullName,
                    Age = player.Age,
                    Level = player.Level,
                    AssetNames = player.PlayerAssets.Select(pa => pa.Asset?.AssetName).ToList(),
                    AssetIds = player.PlayerAssets.Select(pa => pa.AssetId).ToList()
                };

                return Ok(updatedPlayerDto);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating player: {ex}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
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
