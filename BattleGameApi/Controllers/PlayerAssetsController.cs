using BattleGameApi.Data;
using BattleGameApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;

namespace BattleGameApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PlayerAssetsController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly ILogger<PlayerAssetsController> _logger;

        public PlayerAssetsController(AppDbContext db, ILogger<PlayerAssetsController> logger)
        {
            _db = db;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var list = await _db.PlayerAssets
                    .Include(pa => pa.Player)
                    .Include(pa => pa.Asset)
                    .AsNoTracking()
                    .ToListAsync();

                _logger.LogInformation("Retrieved {Count} player assets", list.Count);
                return Ok(list);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting player assets");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost]
        public async Task<IActionResult> Assign([FromBody] PlayerAsset input)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var p = await _db.Players.FindAsync(input.PlayerId);
                var a = await _db.Assets.FindAsync(input.AssetId);

                if (p == null || a == null)
                {
                    _logger.LogWarning("Player {PlayerId} or Asset {AssetId} not found", input.PlayerId, input.AssetId);
                    return BadRequest("Player or Asset not found.");
                }

                if (p.Level < a.LevelRequired)
                {
                    _logger.LogWarning("Player level {PlayerLevel} < required {RequiredLevel}", p.Level, a.LevelRequired);
                    return BadRequest($"Player level {p.Level} is lower than required level {a.LevelRequired} for this asset.");
                }

                // Check if already assigned
                var existing = await _db.PlayerAssets
                    .FirstOrDefaultAsync(pa => pa.PlayerId == input.PlayerId && pa.AssetId == input.AssetId);

                if (existing != null)
                {
                    _logger.LogWarning("Asset {AssetId} already assigned to player {PlayerId}", input.AssetId, input.PlayerId);
                    return Conflict("This asset is already assigned to the player");
                }

                _db.PlayerAssets.Add(input);
                await _db.SaveChangesAsync();

                _logger.LogInformation("Assigned asset {AssetId} to player {PlayerId}", input.AssetId, input.PlayerId);

                // Reload with related data
                var result = await _db.PlayerAssets
                    .Include(pa => pa.Player)
                    .Include(pa => pa.Asset)
                    .FirstOrDefaultAsync(pa => pa.PlayerAssetId == input.PlayerAssetId);

                return CreatedAtAction(nameof(GetAll), new { id = input.PlayerAssetId }, result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error assigning asset to player");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Remove(int id)
        {
            try
            {
                var pa = await _db.PlayerAssets.FindAsync(id);
                if (pa == null)
                {
                    _logger.LogWarning("PlayerAsset {Id} not found for deletion", id);
                    return NotFound();
                }

                _db.PlayerAssets.Remove(pa);
                await _db.SaveChangesAsync();

                _logger.LogInformation("Removed player asset {Id}", id);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error removing player asset {Id}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpDelete("byPlayerAndAsset")]
        public async Task<IActionResult> RemoveByPlayerAndAsset([FromQuery] int playerId, [FromQuery] int assetId)
        {
            try
            {
                var pa = await _db.PlayerAssets
                    .FirstOrDefaultAsync(x => x.PlayerId == playerId && x.AssetId == assetId);

                if (pa == null)
                {
                    _logger.LogWarning("PlayerAsset not found for player {PlayerId} and asset {AssetId}", playerId, assetId);
                    return NotFound();
                }

                _db.PlayerAssets.Remove(pa);
                await _db.SaveChangesAsync();

                _logger.LogInformation("Removed asset {AssetId} from player {PlayerId}", assetId, playerId);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error removing asset {AssetId} from player {PlayerId}", assetId, playerId);
                return StatusCode(500, "Internal server error");
            }
        }
    }
}