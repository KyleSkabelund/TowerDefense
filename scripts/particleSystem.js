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
        ret.AddCreepDeathSystem = function(row, col, graphics, dim, score) {
            let spec = {
                count: 1,
                position: { x: col, y: row },
                speed: { mean: 0.01, stdev: 0},
                lifetime: { mean: 1000, stdev: 0 }, //last one second
                size: { mean: 96, stdev: 1 },
                image: 'Data/PNG/Retina/towerDefense_tile308.png'
            };

            if(score == 100) spec.image = 'Data/PNG/Retina/towerDefense_tile309.png';

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
                alphaReductionRate: 0.0025
            };
            newSystem.particles.push(p);
            ret.systems.push(newSystem);
        }

        //ground towers projectile?
        ret.AddBombMovementSystem = function(row, col, graphics, dim, thrustAngle) {
            let spec = {
                count: 50,
                direction: { x: Math.cos(-thrustAngle), y: Math.sin(-thrustAngle) },
                position: { x: col*dim.width, y: row*dim.height+topBarHeight },
                speed: { mean: 0.05, stdev: 0.02},
                lifetime: { mean: 700, stdev: 50 },
                size: { mean: 5, stdev: 2 },
                image: '/Data/smokeparticleassets/PNG/Black smoke/blackSmoke00.png'
            };

            let newSystem = System(spec, graphics);
            //end smoke

            //start fire
            newSystem.fillDirectionalSystem(spec);
            ret.systems.push(newSystem);

            let spec2 = {
                count: 20,
                direction: { x: Math.cos(-thrustAngle), y: Math.sin(-thrustAngle) },
                position: { x: col*dim.width, y: row*dim.height+topBarHeight },
                speed: { mean: 0.03, stdev: 0.01},
                lifetime: { mean: 500, stdev: 50 },
                size: { mean: 3, stdev: 2 },
                image: '/Data/smokeparticleassets/PNG/Explosion/explosion00.png'
            };

            let newSystem2 = System(spec2, graphics);

            newSystem2.fillDirectionalSystem(spec);
            ret.systems.push(newSystem2);
        }
        ret.AddBombExplosionSystem = function(row, col, graphics, dim) {
            let spec = {
                count: 500,
                position: { x: col*dim.width, y: row*dim.height+topBarHeight },
                speed: { mean: 0.05, stdev: 0.02},
                lifetime: { mean: 5000, stdev: 50 },
                size: { mean: 5, stdev: 2 },
                image: '/Data/smokeparticleassets/PNG/Black smoke/blackSmoke00.png'
            };

            let newSystem = System(spec, graphics);
            //end smoke

            //start fire
            newSystem.fillSystem(spec);
            ret.systems.push(newSystem);

            let spec2 = {
                count: 250,
                position: { x: col*dim.width, y: row*dim.height+topBarHeight },
                speed: { mean: 0.05, stdev: 0.02},
                lifetime: { mean: 250, stdev: 50 },
                size: { mean: 5, stdev: 2 },
                image: '/Data/smokeparticleassets/PNG/Explosion/explosion00.png'
            };

            let newSystem2 = System(spec2, graphics);

            newSystem2.fillSystem(spec2);
            ret.systems.push(newSystem2);
        }

        ret.AddGuidedMissileMovementSystem = function(row, col, graphics, dim, thrustAngle) {
            let spec = {
                count: 50,
                direction: { x: Math.cos(-thrustAngle), y: Math.sin(-thrustAngle) },
                position: { x: col*dim.width, y: row*dim.height+topBarHeight },
                speed: { mean: 0.05, stdev: 0.02},
                lifetime: { mean: 700, stdev: 50 },
                size: { mean: 5, stdev: 2 },
                image: '/Data/smokeparticleassets/PNG/Black smoke/blackSmoke00.png'
            };

            let newSystem = System(spec, graphics);
            //end smoke

            //start fire
            newSystem.fillDirectionalSystem(spec);
            ret.systems.push(newSystem);

            let spec2 = {
                count: 20,
                direction: { x: Math.cos(-thrustAngle), y: Math.sin(-thrustAngle) },
                position: { x: col*dim.width, y: row*dim.height+topBarHeight },
                speed: { mean: 0.03, stdev: 0.01},
                lifetime: { mean: 500, stdev: 50 },
                size: { mean: 3, stdev: 2 },
                image: '/Data/smokeparticleassets/PNG/Explosion/explosion00.png'
            };

            let newSystem2 = System(spec2, graphics);

            newSystem2.fillDirectionalSystem(spec);
            ret.systems.push(newSystem2);
        }
        ret.AddGuidedMissileExplosionSystem = function(spec, graphics) {
            let spec = {
                count: 1000,
                position: { x: col*dim.width, y: row*dim.height+topBarHeight },
                speed: { mean: 0.05, stdev: 0.02},
                lifetime: { mean: 500, stdev: 100 },
                size: { mean: 10, stdev: 5 },
                image: '/Data/smokeparticleassets/PNG/Black smoke/blackSmoke00.png'
            };

            let newSystem = System(spec, graphics);
            //end smoke

            //start fire
            newSystem.fillSystem(spec);
            ret.systems.push(newSystem);

            let spec2 = {
                count: 100,
                position: { x: col*dim.width, y: row*dim.height+topBarHeight },
                speed: { mean: 0.05, stdev: 0.02},
                lifetime: { mean: 400, stdev: 100 },
                size: { mean: 10, stdev: 5 },
                image: '/Data/smokeparticleassets/PNG/Explosion/explosion00.png'
            };

            let newSystem2 = System(spec2, graphics);

            newSystem2.fillSystem(spec2);
            ret.systems.push(newSystem2);
        }

        //money gained from selling tower floats upwards and persist 3 second
        ret.AddSoldTowerSystem = function(row, col, graphics, dim) {
            let spec = {
                count: 1,
                position: { x: col*dim.width, y: row*dim.height+topBarHeight },
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
                alphaReductionRate: 0.0025
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
                    alphaReductionRate: 0
	    	    };
	    	    ret.particles.push(p)
            }
        }

        ret.fillDirectionalSystem = function(spec) {
            for (let particle = 0; particle < ret.totalParticleCount; particle++) {
	    	    let p = {
	    	    	position: { x: spec.position.x, y: spec.position.y },
	    	    	direction: spec.direction,
	    	    	speed: Random.nextGaussian( spec.speed.mean, spec.speed.stdev ),	// pixels per millisecond
                    rotation: 0,
                    rotationRate: Random.nextGaussian( spec.speed.mean, spec.speed.stdev ),
	    	    	lifetime: Random.nextGaussian(spec.lifetime.mean, spec.lifetime.stdev),	// milliseconds
	    	    	alive: 0,
                    size: Random.nextGaussian(spec.size.mean, spec.size.stdev),
                    alpha: 1,
                    alphaReductionRate: 0
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