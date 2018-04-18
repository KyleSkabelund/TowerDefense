MyGame.particleSystem = (function(graphics, random) {
    'use strict';

    function ParticleSystems() {
        let ret = {
            systems : []
        };

        ret.updateSystems = function(elapsedTime) {
            let keepSystems = [];
            for(var system = 0; system < ret.systems.length; ++system) {
                ret.systems[system].update(elapsedTime);
                if(ret.systems[system].particles.length > 0) {
                    keepSystems.push(ret.systems[system]);
                }
            }

            ret.systems = keepSystems;
        }

        ret.renderSystems = function(graphics) {
            for(var system = 0; system < ret.systems.length; ++system) {
                ret.systems[system].render(graphics);
            }
        }

        //score will float upwards and persist one second
        ret.AddCreepDeathSystem = function(spec, graphics, creepScore) {
            let newSystem = System(spec, graphics);
            ret.systems.push(newSystem);
            newSystem.fillSystem(spec);

        }

        //ground towers projectile?
        ret.AddBombMovementSystem = function(spec, graphics) {
            //fire/smoke in a direction
        }
        ret.AddBombExplosionSystem = function(spec, graphics) {
            //fire/smoke 360 degrees
        }

        //air defense projectile?
        ret.AddGuidedMissileSystem = function(spec, graphics) {
            //fire/smoke in a direction
        }
        ret.AddGuidedMissileSystem = function(spec, graphics) {
            //fire/smoke 360 degrees
        }

        //money gained from selling tower floats upwards and persist 3 second
        ret.AddSoldTowerSystem = function(row, col, graphics, dim) {
            let spec = {
                count: 1,
                position: { x: col*dim.width+dim.width, y: row*dim.height+topBarHeight },
                speed: { mean: 0.01, stdev: 0},
                lifetime: { mean: 3000, stdev: 0 },
                size: { mean: 96, stdev: 1 },
                image: 'Data/PNG/Retina/towerDefense_tile287.png'
            };

            let newSystem = System(spec, graphics);

            let p = {
                position: spec.position,
	    	    direction: {x: Math.cos(3*Math.PI/2), y: Math.sin(3*Math.PI/2)},
	    	    speed: Random.nextGaussian( spec.speed.mean, spec.speed.stdev ),	// pixels per millisecond
                rotation: 0,
                rotationRate: 0,
	    	    lifetime: Random.nextGaussian(spec.lifetime.mean, spec.lifetime.stdev),	// milliseconds
	    	    alive: 0,
                size: Random.nextGaussian(spec.size.mean, spec.size.stdev),
                alpha: 1,
                alphaReductionRate: 0.005
            };
            newSystem.particles.push(p);
            ret.systems.push(newSystem);
        }

        return ret;
    }

    /*
    Example spec
    {
        count: 50,
        position: { x: 300, y: 300},
        speed: { mean: 0.02, stdev: 0.0125},
        lifetime: { mean: 3000, stdev: 1000 },
        size: { mean: 7, stdev: 3 },
        image: 'Data/PNG/Retina/towerDefense_tile287.png'
    }
    */

    function System(spec, graphics) {
        let image = new Image();
        let ret = {
            totalParticleCount: spec.count,
            position: spec.position, //x and y
		    speed: spec.speed,
		    lifetime: spec.lifetime,
		    size: spec.size,
		    image: spec.image,
            particles: []
        };
    

        image.onload = function(graphics) {
            ret.render = function(graphics) {
			    for (let particle = 0; particle < ret.particles.length; particle++) {
			    	if (ret.particles[particle].alive >= 100) {
			    		graphics.drawParticle(
			    			ret.particles[particle].position,
			    			ret.particles[particle].size,
			    			ret.particles[particle].rotation,
			    			image, ret.particles[particle].alpha);
				    }
			    }
		    };
        }

        image.src = spec.image;

        ret.update = function(elapsedTime) {
            let keepMe = [];

            for (let particle = 0; particle < ret.particles.length; particle++) {
		    	ret.particles[particle].alive += elapsedTime;
		    	ret.particles[particle].position.x += (elapsedTime * ret.particles[particle].speed * ret.particles[particle].direction.x);
		    	ret.particles[particle].position.y += (elapsedTime * ret.particles[particle].speed * ret.particles[particle].direction.y);
                ret.particles[particle].rotation += ret.particles[particle].rotationRate / .5;
                ret.particles[particle].alpha -= ret.particles[particle].alphaReductionRate;

		    	if (ret.particles[particle].alive <= ret.particles[particle].lifetime && ret.particles[particle].alpha >= 0) {
		    		keepMe.push(ret.particles[particle]);
		    	}
		    }

		    ret.particles = keepMe;
        };

        ret.fillSystem = function(spec) {
            for (let particle = 0; particle < ret.totalParticleCount; particle++) {
	    	    let p = {
	    	    	position: { x: spec.position.x, y: spec.position.y },
	    	    	direction: Random.nextCircleVector(),
	    	    	speed: Random.nextGaussian( spec.speed.mean, spec.speed.stdev ),	// pixels per millisecond
                    rotation: 0,
                    rotationRate: Random.nextGaussian( spec.speed.mean, spec.speed.stdev ),
	    	    	lifetime: Random.nextGaussian(spec.lifetime.mean, spec.lifetime.stdev),	// milliseconds
	    	    	alive: 0,
                    size: Random.nextGaussian(spec.size.mean, spec.size.stdev),
                    alpha: 1,
                    alphaReductionRate: 0.1
	    	    };
	    	    ret.particles.push(p)
            }
        }

        ret.render = function() {};   

        return ret;
    }

    return {
        ParticleSystems : ParticleSystems
	};
}(MyGame.graphics, MyGame.random));