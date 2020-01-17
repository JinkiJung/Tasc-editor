var margin = 10;
function avoidOverlap(items, startingHeight, editorPaneWidth, newItemWidth, newItemHeight){
    for (var y=startingHeight; y< 10000 ;){
        for (var x=0; x<editorPaneWidth ; ){
            var everOverlapped = false;
            var maxOverlappedWidth = x;
            var maxOverlappedHeight = y;

            for(var t=0; t<items.length ; t++){
                var rect = items[t];
                if(rect===undefined)
                    continue;

                if(doOverlap(x,y,x+newItemWidth, y+newItemHeight,
                    getNumber(rect, 'x'), getNumber(rect, 'y'),
                    getNumber(rect, 'x') + getNumber(rect, 'width'), getNumber(rect, 'y') +getNumber(rect, 'height'))){
                    everOverlapped = true;

                    if(maxOverlappedWidth < getNumber(rect, 'x') + getNumber(rect, 'width'))
                        maxOverlappedWidth = getNumber(rect, 'x') + getNumber(rect, 'width');
                    if(maxOverlappedHeight < getNumber(rect, 'y') + getNumber(rect, 'height'))
                        maxOverlappedHeight = getNumber(rect, 'y') + getNumber(rect, 'height');
                    break;
                }
            }

            if(x+newItemWidth>=editorPaneWidth){
                x = 0;
                y = maxOverlappedHeight + margin;
                break;
            }
            else if(everOverlapped){
                x =maxOverlappedWidth+margin;
            }
            else{
                return [x,y];
            }
        }
    }
    return undefined;
}

function getNumber(elem, attr){
    return parseFloat(elem.getAttribute(attr));
}

// Returns true if two rectangles (l1, r1) and (l2, r2) overlap
function doOverlap(l1_x, l1_y, r1_x, r1_y, l2_x, l2_y, r2_x, r2_y)
{
    // If one rectangle is on left side of other
    if (l1_x > r2_x || l2_x > r1_x)
        return false;

    // If one rectangle is above other
    if (l1_y > r2_y || l2_y > r1_y)
        return false;

    return true;
}