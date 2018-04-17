MyGame.particleSystems = (function(graphics, random) {
    'use strict';

    function ParticleSystems() {
        let ret = {
            systems : []
        };

        that.updateSystems = function(elapsedTime) {
            for(var system = 0; system < that.systems.length; ++system) {
                that.systems[system].update(elapsedTime);
            }


            //delete expired systems
        }

        that.renderSystems = function() {
            for(var system = 0; system < that.systems.length; ++system) {
                that.systems[system].render();
            }
        }

        //score will float upwards and persist one second
        that.AddCreepDeathSystem = function(spec, graphics, creepScore) {

        }

        //ground towers projectile?
        that.AddBombMovementSystem = function(spec, graphics) {
            //fire/smoke in a direction
        }
        that.AddBombExplosionSystem = function(spec, graphics) {
            //fire/smoke 360 degrees
        }

        //air defense projectile?
        that.AddGuidedMissileSystem = function(spec, graphics) {
            //fire/smoke in a direction
        }
        that.AddGuidedMissileSystem = function(spec, graphics) {
            //fire/smoke 360 degrees
        }

        //money gained from selling tower floats upwards and persist one second
        that.AddSoldTowerSystem = function(spec, graphics) {
            
        }

        return ret;
    }

    function System(spec, graphics) {
        let image = new Image();
        let ret = {
            totalParticleCount: spec.count,
            position: spec.position, //x and y
		    speed: spec.speed,
		    lifetime: spec.lifetime,
		    size: spec.size,
		    fill: spec.fill,
		    image: spec.image,
            particles: []
        };
    

        image.onload = function() {
            ret.render = function() {
			    for (let particle = 0; particle < ret.particles.length; particle++) {
			    	if (ret.particles[particle].alive >= 100) {
			    		graphics.drawImage(
			    			ret.particles[particle].position,
			    			ret.particles[particle].size,
			    			ret.particles[particle].rotation,
			    			image);
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
		    	ret.particles[particle].rotation += ret.particles[particle].speed / .5;

		    	if (ret.particles[particle].alive <= ret.particles[particle].lifetime) {
		    		keepMe.push(ret.particles[particle]);
		    	}
		    }

		    ret.particles = keepMe;
        };

        ret.fillSystem = function(spec) {
            for (let particle = 0; particle < ret.particleCount; particle++) {
	    	    let p = {
	    	    	position: { x: spec.position.x, y: spec.position.y },
	    	    	direction: Random.nextCircleVector(),
	    	    	speed: Random.nextGaussian( spec.speed.mean, spec.speed.stdev ),	// pixels per millisecond
	    	    	rotation: 0,
	    	    	lifetime: Random.nextGaussian(spec.lifetime.mean, spec.lifetime.stdev),	// milliseconds
	    	    	alive: 0,
	    	    	size: Random.nextGaussian(spec.size.mean, spec.size.stdev),
	    	    	fill: spec.fill,
	    	    	stroke: 'rgb(0, 0, 0)'
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