import Collider from './collider';
import Particle from './particle';

export default function initColliders() {
    Collider.createSimple = function(canvasID){
        var o = {
            handlers: {
                particlesFactory: function(canvasWidth, canvasHeight, ratio) {
                    var particles = [];
                    var count = canvasWidth * canvasHeight / (10000 * ratio);
                    var x = 0,
                        y = 0;
                    for(var i = 0; i < count; i++){
                        x = Math.random() * canvasWidth;
                        y = Math.random() * canvasHeight;
            
                        var particle = new Particle(i, x, y);
                        particle.velocity.x = Math.random() -0.5;
                        particle.velocity.y = Math.random() -0.5;
                        particle.velocity.nor();
                        particle.speed = 2;
                        particles.push(particle);
                    }
            
                    return particles;
                }
            }
        }
    
        return new Collider(canvasID, o);
    }
}