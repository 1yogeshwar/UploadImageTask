function calculatePosition(images) {
    let landscapeCount = 0;
    let portraitCount = 0;
    return images.map((img, index) => {
        let position;
        if (img.orientation === 'landscape') {
            landscapeCount++;
            if (landscapeCount === 1) position = 1;
            else if (landscapeCount === 2) position = 4;
            else if (landscapeCount === 3) position = 7;
            else if (landscapeCount === 4) position = 10;
            else if (landscapeCount === 5) position = 13;
            else if (landscapeCount === 6) position = 16;
            else position = ((landscapeCount - 1) * 3) + 1;
        } else {
            portraitCount++;
            if (portraitCount === 1) position = 2;
            else if (portraitCount === 2) position = 3;
            else if (portraitCount === 3) position = 5;
            else if (portraitCount === 4) position = 6;
            else if (portraitCount === 5) position = 8;
            else if (portraitCount === 6) position = 9;
            else if (portraitCount === 7) position = 11;
            else if (portraitCount === 8) position = 12;
            else if (portraitCount === 9) position = 14;
            else if (portraitCount === 10) position = 15;
            else position = ((portraitCount - 1) * 2) + 2;
        }
        return { ...img, position, index: index + 1 };
    });
}

module.exports = calculatePosition;
