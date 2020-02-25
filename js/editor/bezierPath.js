var bezierWeight = 0.675;

function updatePath(path, x4, y4, x1, y1) {
    x1 = parseFloat(x1);
    y1 = parseFloat(y1);
    x4 = parseFloat(x4);
    y4 = parseFloat(y4);

    var dx = Math.abs(x4 - x1) * bezierWeight;
    var x2 = x1 - dx;
    var x3 = x4 + dx;
    var data = `M${x1} ${y1} C ${x2} ${y1} ${x3} ${y4} ${x4} ${y4}`;
    path.setAttribute("d", data);

    path.setAttributeNS(null, 'start_x', x4);
    path.setAttributeNS(null, 'start_y', y4);
    path.setAttributeNS(null, 'end_x', x1);
    path.setAttributeNS(null, 'end_y', y1);

}