
export default function Render(context, width, height, particles, grid, options) {
    context.clearRect(0, 0, width, height);
    context.lineWidth = 1.5;
    var particle = null;

    for(var i = 0; i < particles.length; i++){
        particle = particles[i];
        context.fillStyle = 'rgba(255, 255, 255, ' +particle.jointAlpha.toPrecision(3) + ')';
        context.strokeStyle = 'rgba(255, 255, 255, ' + particle.linkAlpha.toPrecision(3) + ')';
        context.beginPath();        
        context.arc(particle.position.x, particle.position.y, particle.radius, 0, 2 * Math.PI);
        context.fill();

        for(var y = 0; y < particle.childs.length; y++){            
            context.strokeStyle = 'rgba(255, 255, 255, ' + particle.connectionsMap[particle.childs[y].id+""].toPrecision(3) + ')';
            context.beginPath();
            context.moveTo(particle.position.x, particle.position.y);
            context.lineTo(particle.childs[y].position.x, particle.childs[y].position.y);
            context.stroke();
        }
    }

    //drawTriangles(context, grid);

    if(options.debug.showGrid) {
        context.strokeStyle = 'green';
        context.fillStyle = 'rgba(255, 255, 255, 0.5)';
        grid.iterateCells(function(cell) {
            
            context.font = "10px Arial";
            context.fillText(cell.id, cell.left, cell.top + 10);
            context.rect(cell.left, cell.top, cell.width, cell.height);
            if(cell.isSelected) {
                context.fillStyle = 'rgba(0, 0, 255, 0.3)';
                context.fillRect(cell.left, cell.top, cell.width, cell.height);
                context.fillStyle = 'rgba(255, 255, 255, 0.5)';
            }
        });
        context.stroke();
    }
}