function bounce(particles, delta, grid) {
    for(var i = 0; i < particles.length; i++){
        particles[i].update(delta);

        if(particles[i].position.x > grid.width){
            particles[i].velocity.x *= -1;
            particles[i].position.x = grid.width;
        }

        if(particles[i].position.x < 0){
            particles[i].velocity.x *= -1;
            particles[i].position.x = 0;
        }

        if(particles[i].position.y > grid.height){
            particles[i].velocity.y *= -1;
            particles[i].position.y = grid.height;
        }

        if(particles[i].position.y < 0){
            particles[i].velocity.y *= -1;
            particles[i].position.y = 0;
        }
    }
}

export default {
    bounce: bounce
}