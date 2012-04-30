/**
 * Copyright 2006 Jason Harwig
 * This file can be used without restrictions if this message is kept intact
 * @author jason harwig (jason.harwig@nearinfinity.com)
 */
var ParticleEngine = Class.create();
var Particle = Class.create();
ParticleEngine.MAX_PARTICLES = 10;
ParticleEngine.IMG = '/blogs/assets/jharwig/particle/large_particle_black.png';
ParticleEngine.prototype = {
    initialize: function(id, options) {
        this.id = id;
        this.options = options;
        this.particles = $A();
        this.max_particles = options.max_particles || ParticleEngine.MAX_PARTICLES;
        this.vel_range = [(options.vel&&options.vel[0]) || -1, (options.vel&&options.vel[1]) || 1];
        this.life_range = [(options.life && options.life[0]) || .01, (options.life && options.life[1]) || .02];
        this.event_type = options.event_type || 'click';
        this.x_force = options.x_force || 0;
        this.y_force = options.y_force || 0;
        this.size = options.size;
        this.respawn = options.respawn || 1;
        this.prepareParticles();
        this.attachEvent();
    },
    prepareParticles: function() {
        var obj = $(this.id);
        var pos = Position.cumulativeOffset(obj);
        var dims = Element.getDimensions(obj);
        pos[0] += dims.width/2;
        pos[1] += dims.height/2;
        var inst = this;
        this.max_particles.times(function(value, index) {
            inst.particles.push(new Particle(pos[0], pos[1], inst, inst.id + 'p' + index));
        });
    },
    attachEvent: function() {
        Event.observe($(this.id), this.event_type, this.emit.bindAsEventListener(this));
    }, 
    emit: function(event) {
        this.start();
    },
    start: function() {
        var obj = $(this.id);
        Element.makePositioned(obj);
        this.zIndexSaved = obj.style.zIndex;
        obj.style.zIndex = 9999;
        this.particles.each(function(particle) {
            if (!particle.alive) {
                particle.alive = true;
                particle.curr_respawn = particle.respawn;
            }
        });
        this.update();
    },
    update: function() {
        var inst = this;
        this.particles.each(function(particle) {
            if (particle.alive) {
                particle.draw(function(vel) {
                    vel[0] += inst.x_force;
                    vel[1] += inst.y_force;
                    return vel;
                });                
            }
        });
        var anyAlive = this.particles.inject(false, function(anyAlive, particle) {
           if (!particle.alive && --particle.curr_respawn > 0) {
               particle.reset(undefined, true);
           }
           return anyAlive || particle.alive; 
        });
        if (anyAlive) {
            setTimeout(this.update.bind(this), 20);   
        } else {
            var obj = $(this.id);
            obj.style.zIndex = this.zIndexSaved;
            this.zIndexSaved = 0;
            Element.undoPositioned(obj);
        }
    }
};
Particle.prototype = {
    DT: .3, 
    initialize: function(x,y,engine, id) {
        this.initPos = [x,y];
        this.pos = [x, y];
        this.vel = [this.calc_random(engine.vel_range[0], engine.vel_range[1]),
                    this.calc_random(engine.vel_range[0], engine.vel_range[1])];
        this.id = id;
        this.opacity = 0;
        this.alive = true;
        this.life_dec = this.calc_random(engine.life_range[0], engine.life_range[1]);
        this.engine = engine;
        this.respawn = engine.respawn;
        this.curr_respawn = engine.respawn;
        this.addToPage();
    },
    calc_random: function(min, max) {
        var rnd = (max - min) * Math.random() + min;
        return rnd;
    }, 
    addToPage: function() {
        var img = Builder.node('img', { src:ParticleEngine.IMG, id: this.id });
        this.reset(img, true);
        img.style.position = 'absolute';
        if (this.engine.size) {
            img.style.width = this.engine.size + 'px';
            img.style.height = this.engine.size + 'px';            
        }
        document.body.appendChild(img);
        var dims = Element.getDimensions(img);
        this.initPos[0] = this.initPos[0] - dims.width/2;
        this.initPos[1] = this.initPos[1] - dims.height/2;
        this.pos = this.initPos.toArray();
    },
    draw: function(velocity_callback) {
        var inst = this;
        var img = $(this.id);
        if (this.opacity < 0) {
            this.reset(img, false);
        } else {
            if (this.opacity > 1.0) {
                this.opacity = 1;
                this.opacity_delta *= -1/5;
            }
            img.show();
            img.style.left = this.pos[0] + 'px';
            img.style.top = this.pos[1] + 'px';
            Element.setOpacity(img, this.opacity);
            this.vel = velocity_callback(this.vel);
            this.pos[0] += this.vel[0] * this.DT;
            this.pos[1] += this.vel[1] * this.DT;
            this.opacity += this.opacity_delta;
        }
    },
    reset: function(img, shouldBeAlive) {
        if (!img) img = $(this.id);
        img.hide();
        this.alive = shouldBeAlive;
        this.opacity = 0.0;
        this.opacity_delta = this.life_dec*5;
        this.pos[0] = this.initPos[0];
        this.pos[1] = this.initPos[1];
        this.vel = [this.calc_random(this.engine.vel_range[0], this.engine.vel_range[1]),
                    this.calc_random(this.engine.vel_range[0], this.engine.vel_range[1])];
        this.life_dec = this.calc_random(this.engine.life_range[0], this.engine.life_range[1]);
    }
}

var tmpImage = new Image();
tmpImage.src = ParticleEngine.IMG;

/*** INIT ***/
Event.observe(window, 'load', function() {
   $$('.emitter').each(function(value, index) {
       if (value.id == '') value.id = 'particleEmitter' + index;
       new ParticleEngine(value.id, eval('({'+(value.getAttribute('options')||'')+'})'));
   });
   tmpImage = undefined;
});