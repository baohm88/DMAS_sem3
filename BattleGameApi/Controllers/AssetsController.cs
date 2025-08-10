using BattleGameApi.Data;
using BattleGameApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BattleGameApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AssetsController : ControllerBase
    {
        private readonly AppDbContext _db;
        public AssetsController(AppDbContext db) => _db = db;

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                var assets = await _db.Assets.ToListAsync();
                return Ok(assets);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> Get(int id)
        {
            try
            {
                var asset = await _db.Assets.FindAsync(id);
                if (asset == null) return NotFound();
                return Ok(asset);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create(Asset input)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (input.LevelRequired <= 0)
                    return BadRequest("LevelRequired must be greater than 0");

                _db.Assets.Add(input);
                await _db.SaveChangesAsync();
                return CreatedAtAction(nameof(Get), new { id = input.AssetId }, input);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, Asset input)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (input.LevelRequired <= 0)
                    return BadRequest("LevelRequired must be greater than 0");

                var exist = await _db.Assets.FindAsync(id);
                if (exist == null) return NotFound();

                exist.AssetName = input.AssetName;
                exist.LevelRequired = input.LevelRequired;
                await _db.SaveChangesAsync();

                return Ok(exist);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var asset = await _db.Assets.FindAsync(id);
                if (asset == null) return NotFound();

                _db.Assets.Remove(asset);
                await _db.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error");
            }
        }
    }
}