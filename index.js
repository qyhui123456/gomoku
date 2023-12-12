const root = document.querySelector('.root');
const mask = document.querySelector('.mask');
const text = document.querySelector('.text');
const activeText = document.querySelector('.active_text')
const confirmBtn = document.querySelector('.confirm_btn')
const cancelBtn = document.querySelector('.cancel_btn')
const closeBtn = document.querySelector('.close_btn');
const canvas = document.querySelector('canvas');
const tips = document.querySelector('.active_tips');
const black = document.querySelector('.black_chess')
const white = document.querySelector('.white_chess')
const ctx = canvas.getContext('2d');
// 表示当前活动棋子的颜色
let active = undefined;
// 表示对局是否结束
let done = false;
// 表示上一次活动的棋子
let preChess = undefined;
ctx.strokeStyle = 'black';
function createBoard() {
    for (let x = 25; x < 500; x += 25) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, 500)
        ctx.stroke()
    }
    for (let y = 25; y < 500; y += 25) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(500, y)
        ctx.stroke()
    }
}
createBoard();

const chessArr = []
function createChess() {
    let num = 0;
    const fragment = document.createDocumentFragment()
    for (let x = 0; x <= 500; x += 25) {
        for (let y = 0; y <= 500; y += 25) {
            const element = document.createElement('div')
            element.setAttribute('class', 'chess');
            element.style.left = x + 22 + 2 + 'px';
            element.style.top = y + 22 + 2 + 'px';
            const chess = {
                x: x,
                y: y,
                num: num,
                status: 'hidden',
                element: element,
                color: undefined,
                _left: undefined,
                _right: undefined,
                _top: undefined,
                _bottom: undefined,
                _upleft: undefined,
                _upright: undefined,
                _leftLower: undefined,
                _rightLower: undefined,

            };
            element.addEventListener('click', function (e) {
                if (!active) return
                if (done) {
                    mask.className = 'mask mask_enter'
                    return
                }
                chessArr.forEach(chess => {
                    if (chess.element === e.target) {
                        if (chess.status === 'hidden') {
                            chess.status = 'visible';
                            chess.color = active;
                            // console.log(chess.element.style.backgroundColor);
                            chess.element.className += ` ${active}`;
                            let l = checkLeft(chess, chess.color)
                            let r = checkRight(chess, chess.color)

                            let t = checkTop(chess, chess.color)
                            let b = checkBottom(chess, chess.color)

                            let ul = checkUpleft(chess, chess.color)
                            let rl = checkRightLower(chess, chess.color)

                            let ur = checkUpright(chess, chess.color)
                            let ll = checkLeftLower(chess, chess.color)
                            // console.log(l + r);
                            if (l + r + 1 === 5 || t + b + 1 === 5 || ul + rl + 1 === 5 || ur + ll + 1 === 5) {
                                console.log('win');
                                if (active === 'white') { text.innerText = '游戏结束，白色获胜' }
                                else { text.innerText = '游戏结束，黑色获胜' }
                                setTimeout(() => { mask.className = 'mask mask_enter' }, 100)
                                done = true
                            }
                            if (active === 'white') {
                                active = 'black';
                                // setTimeout(intercept, 500, 'white')
                                if (isAi) { setTimeout(chessDown, 500, 'black', 3) }
                            } else {
                                active = 'white';
                            }
                            changeStyle(chess)
                        }
                    }
                });
            })
            fragment.appendChild(element)
            chessArr[num++] = chess
        }
    }
    root.appendChild(fragment)
    console.log(chessArr);
}
createChess()


function changeStyle(chess) {
    if (preChess) { preChess.className = `chess ${active}` };
    chess.element.className += '  chess_active';
    preChess = chess.element
    tips.style.backgroundColor = active;
    activeText.innerText = active === 'white' ? '白子' : '黑子';
}

function getNear() {
    chessArr.forEach((chess) => {
        const x = chess.x
        const y = chess.y
        if (y > 0) {
            chess._top = chessArr[chess.num - 1]
        }
        if (y < 500) {
            chess._bottom = chessArr[chess.num + 1]
        }
        if (x > 0) {
            chess._left = chessArr[chess.num - 21]
        }
        if (x < 500) {
            chess._right = chessArr[chess.num + 21]
        }
        if (y > 0 && x > 0) {
            chess._upleft = chessArr[chess.num - 22]
        }
        if (y > 0 && x < 500) {
            chess._upright = chessArr[chess.num + 20]
        }
        if (y < 500 && x > 0) {
            chess._leftLower = chessArr[chess.num + 1 - 21]
        }
        if (y < 500 && x < 500) {
            chess._rightLower = chessArr[chess.num + 1 + 21]
        }
    })
}
getNear()

function checkLeft(chess, color = 'white', count = 0) {
    if (chess._left && chess._left.color === color) {
        return checkLeft(chess._left, color, ++count)
    }
    leftChess = chess._left;
    return count
}
function checkRight(chess, color = 'white', count = 0) {
    if (chess._right && chess._right.color === color) {
        return checkRight(chess._right, color, ++count)
    }
    rightChess = chess._right
    return count
}
function checkTop(chess, color = 'white', count = 0) {
    if (chess._top && chess._top.color === color) {
        return checkTop(chess._top, color, ++count)
    }
    topChess = chess._top
    return count
}
function checkBottom(chess, color = 'white', count = 0) {
    if (chess._bottom && chess._bottom.color === color) {
        return checkBottom(chess._bottom, color, ++count)
    }
    bottomChess = chess._bottom
    return count
}
function checkUpleft(chess, color = 'white', count = 0) {
    if (chess._upleft && chess._upleft.color === color) {
        return checkUpleft(chess._upleft, color, ++count)
    }
    upleftChess = chess._upleft
    return count
}
function checkRightLower(chess, color = 'white', count = 0) {
    if (chess._rightLower && chess._rightLower.color === color) {
        return checkRightLower(chess._rightLower, color, ++count)
    }
    rightLowerChess = chess._rightLower
    return count
}
function checkUpright(chess, color = 'white', count = 0) {
    if (chess._upright && chess._upright.color === color) {
        return checkUpright(chess._upright, color, ++count)
    }
    uprightChess = chess._upright
    return count
}
function checkLeftLower(chess, color = 'white', count = 0) {
    if (chess._leftLower && chess._leftLower.color === color) {
        return checkLeftLower(chess._leftLower, color, ++count)
    }
    leftLowerChess = chess._leftLower
    return count
}

closeBtn.addEventListener('click', function (e) {
    e.preventDefault()
    mask.className = 'mask mask_leave'
})

confirmBtn.addEventListener('click', function () {
    mask.className = 'mask mask_leave'
})

cancelBtn.addEventListener('click', function () {
    mask.className = 'mask mask_leave'
})

// 假定黑色是人机
// 先落后堵
// 找黑堵白
let leftChess = '';
let rightChess = '';
let topChess = '';
let bottomChess = '';
let upleftChess = '';
let uprightChess = '';
let leftLowerChess = '';
let rightLowerChess = '';

// Intercept
function intercept(color, count = 3, pre_eligibles = []) {
    // console.log('i', count);
    // 符合条件的chees集合
    let eligibles = [];
    checkNum = count;
    if (color !== undefined) { checkNum++ }
    for (let i = 0; i < chessArr.length; i++) {
        const chess = chessArr[i];
        if (chess.color === color) {
            let l = checkLeft(chess, 'white')
            let r = checkRight(chess, 'white')
            let t = checkTop(chess, 'white')
            let b = checkBottom(chess, 'white')
            let ul = checkUpleft(chess, 'white')
            let rl = checkRightLower(chess, 'white')
            let ur = checkUpright(chess, 'white')
            let ll = checkLeftLower(chess, 'white')
            // 当count为0，即棋盘上不存在黑色棋子时，黑棋总是会落在白棋上方或者下方
            if (t + b >= count) {
                let status = [false, false]
                if (topChess && topChess.color === undefined) {
                    status[0] = true
                }
                if (bottomChess && bottomChess.color === undefined) {
                    status[1] = true
                }
                if (status[0] && status[1]) {
                    if (color === undefined) {
                        chess.element.click()
                        break
                    }
                    let num = Math.floor(Math.random() * 2)
                    if (num === 0) { topChess.element.click() } // check
                    if (num === 1) { bottomChess.element.click() }
                    break
                    // checkCount(chess, count, position, color = undefined)
                } else if (status[0] && checkCount(topChess, checkNum, '_top', color)) {
                    if (color === undefined) {
                        eligibles.push(chess);
                    } else {
                        eligibles.push(topChess);
                    }
                } else if (status[1] && checkCount(bottomChess, checkNum, '_bottom', color)) {
                    if (color === undefined) {
                        eligibles.push(chess);
                    } else {
                        eligibles.push(bottomChess);
                    }
                }
            } else if (l + r >= count) {
                if (color === undefined) {
                    chess.element.click()
                    break
                }
                let status = [false, false]
                if (leftChess && leftChess.color === undefined) {
                    status[0] = true
                }
                if (rightChess.color && rightChess.color === undefined) {
                    status[1] = true
                }
                // console.log(status, count);
                if (status[0] && status[1]) {
                    let num = Math.floor(Math.random() * 2)
                    if (num === 0) { leftChess.element.click() } // check
                    if (num === 1) { rightChess.element.click() }
                    break
                } else if (status[0] && checkCount(leftChess, checkNum, '_left', color)) {
                    if (color === undefined) {
                        eligibles.push(chess);
                    } else {
                        eligibles.push(leftChess);
                    }
                } else if (status[1] && checkCount(rightChess, checkNum, '_right', color)) {
                    if (color === undefined) {
                        eligibles.push(chess);
                    } else {
                        eligibles.push(rightChess);
                    }
                }
            } else if (ul + rl >= count) {
                if (color === undefined) {
                    chess.element.click()
                    break
                }
                let status = [false, false]
                if (upleftChess && upleftChess.color === undefined) {
                    status[0] = true
                }
                if (rightLowerChess && rightLowerChess.color === undefined) {
                    status[1] = true
                }
                if (status[0] && status[1]) {
                    let num = Math.floor(Math.random() * 2)
                    if (num === 0) { upleftChess.element.click() } // check
                    if (num === 1) { rightLowerChess.element.click() }
                    break
                } else if (status[0] && checkCount(upleftChess, checkNum, '_upleft', color)) {
                    if (color === undefined) {
                        eligibles.push(chess);
                    } else {
                        eligibles.push(upleftChess);
                    }
                } else if (status[1] && checkCount(rightLowerChess, checkNum + b, '_rightLower', color)) {
                    if (color === undefined) {
                        eligibles.push(chess);
                    } else {
                        eligibles.push(rightLowerChess);
                    }
                }
            } else if (ur + ll >= count) {
                if (color === undefined) {
                    chess.element.click()
                    break
                }
                let status = [false, false]
                if (uprightChess && uprightChess.color === undefined) {
                    status[0] = true
                }
                if (leftLowerChess && leftLowerChess.color === undefined) {
                    status[1] = true
                }
                if (status[0] && status[1]) {
                    let num = Math.floor(Math.random() * 2)
                    if (num === 0) { uprightChess.element.click() } // check
                    if (num === 1) { leftLowerChess.element.click() }
                    break
                } else if (status[0] && checkCount(uprightChess, checkNum, '_upright', color)) {
                    if (color === undefined) {
                        eligibles.push(chess);
                    } else {
                        eligibles.push(uprightChess);
                    }
                } else if (status[1] && checkCount(leftLowerChess, checkNum, '_leftLower', color)) {
                    if (color === undefined) {
                        eligibles.push(chess);
                    } else {
                        eligibles.push(leftLowerChess);
                    }
                }
            }
        }
        if (i === chessArr.length - 1 && color !== undefined) {
            intercept(undefined, ++count, eligibles);
        } else if (i === chessArr.length - 1 && color === undefined && count >= 2) {
            if (pre_eligibles.length > 0) {
                pre_eligibles[0].element.click()
            } else if (eligibles.length > 0) {
                eligibles[0].element.click()
            } else { chessDown('black', count - 2); }
        } else if (i === chessArr.length - 1 && count === 1) {
            let num = Math.floor(Math.random() * (chessArr.length + 1))
            return chessArr[num].element.click()
        }
    }
}

function chessDown(color, count, pre_eligibles = []) {
    // console.log('c', count);
    let eligibles = []
    let checkNum = count
    if (color !== undefined) checkNum++
    for (let i = 0; i < chessArr.length; i++) {
        const chess = chessArr[i];
        if (chess.color === color) {
            let l = checkLeft(chess, 'black')
            let r = checkRight(chess, 'black')
            let t = checkTop(chess, 'black')
            let b = checkBottom(chess, 'black')
            let ul = checkUpleft(chess, 'black')
            let rl = checkRightLower(chess, 'black')
            let ur = checkUpright(chess, 'black')
            let ll = checkLeftLower(chess, 'black')
            if (t + b >= count) {
                // 1
                let status = [false, false]
                if (topChess && topChess.color === undefined) {
                    status[0] = true
                }
                if (bottomChess && bottomChess.color === undefined) {
                    status[1] = true
                }
                if (status[0] && status[1]) {
                    if (color === undefined) {
                        chess.element.click()
                        break
                    }
                    let num = Math.floor(Math.random() * 2)
                    if (num === 0) { topChess.element.click() } // check
                    if (num === 1) { bottomChess.element.click() }
                    break
                } else if (status[0] && checkCount(topChess, checkNum, '_top', color)) {
                    if (color === undefined) {
                        eligibles.push(chess);
                    } else {
                        eligibles.push(topChess);
                    }
                } else if (status[1] && checkCount(bottomChess, checkNum, '_bottom', color)) {
                    if (color === undefined) {
                        eligibles.push(chess);
                    } else {
                        eligibles.push(bottomChess);
                    }
                }
            } else if (l + r >= count) {
                // 2
                let status = [false, false]
                if (leftChess && leftChess.color === undefined) {
                    status[0] = true
                }
                if (rightChess && rightChess.color === undefined) {
                    status[1] = true
                }
                if (status[0] && status[1]) {
                    if (color === undefined) {
                        chess.element.click()
                        break
                    }
                    let num = Math.floor(Math.random() * 2)
                    if (num === 0) { leftChess.element.click() }
                    if (num === 1) { rightChess.element.click() }
                    break
                } else if (status[0] && checkCount(leftChess, checkNum, '_left', color)) {
                    if (color === undefined) {
                        eligibles.push(chess);
                    } else {
                        eligibles.push(leftChess);
                    }
                } else if (status[1] && checkCount(rightChess, checkNum, '_right', color)) {
                    if (color === undefined) {
                        eligibles.push(chess);
                    } else {
                        eligibles.push(rightChess);
                    }
                }
            } else if (ul + rl >= count) {
                // 3
                let status = [false, false]
                if (upleftChess && upleftChess.color === undefined) {
                    status[0] = true
                }
                if (rightLowerChess && rightLowerChess.color === undefined) {
                    status[1] = true
                }
                if (status[0] && status[1]) {
                    if (color === undefined) {
                        chess.element.click()
                        break
                    }
                    let num = Math.floor(Math.random() * 2)
                    if (num === 0) { upleftChess.element.click() }
                    if (num === 1) { rightLowerChess.element.click() }
                    break
                } else if (status[0] && checkCount(upleftChess, checkNum, '_upleft', color)) {
                    if (color === undefined) {
                        eligibles.push(chess);
                    } else {
                        eligibles.push(upleftChess);
                    }
                } else if (status[1] && checkCount(rightLowerChess, checkNum + b, '_rightLower', color)) {
                    if (color === undefined) {
                        eligibles.push(chess);
                    } else {
                        eligibles.push(rightLowerChess);
                    }
                }
            } else if (ur + ll >= count) {
                // 4
                let status = [false, false]
                if (uprightChess && uprightChess.color === undefined) {
                    status[0] = true
                }
                if (leftLowerChess && leftLowerChess.color === undefined) {
                    status[1] = true
                }
                if (status[0] && status[1]) {
                    if (color === undefined) {
                        chess.element.click()
                        break
                    }
                    let num = Math.floor(Math.random() * 2)
                    if (num === 0) { uprightChess.element.click() } // check
                    if (num === 1) { leftLowerChess.element.click() }
                    break
                } else if (status[0] && checkCount(uprightChess, checkNum, '_upright', color)) {
                    if (color === undefined) {
                        eligibles.push(chess);
                    } else {
                        eligibles.push(uprightChess);
                    }
                } else if (status[1] && checkCount(leftLowerChess, checkNum, '_leftLower', color)) {
                    if (color === undefined) {
                        eligibles.push(chess);
                    } else {
                        eligibles.push(leftLowerChess);
                    }
                }
            }
        }
        // 满足前面任意条件就会退出循环，执行到此处说明没有满足条件，此时进行下一次判定
        if (i === chessArr.length - 1 && color !== undefined) {
            return chessDown(undefined, ++count, eligibles);
        } else if (i === chessArr.length - 1 && color === undefined) {
            if (pre_eligibles.length > 0) {
                pre_eligibles[0].element.click();
            } else if (eligibles.length > 0) {
                eligibles[0].element.click();
            } else {
                intercept('white', --count);
            }
        }
    }
}

white.addEventListener('click', function (e) {
    if (active) return
    white.className += ' chess_active';
    black.className = 'black_chess';
    active = 'black';
    setTimeout(chessDown, 500, 'black', 3)
})

black.addEventListener('click', function (e) {
    if (active) return
    alert('请选择白色')
})
white.click()
function checkCount(chess, count, position, color = undefined) {
    // console.log(count, chess, position);
    // 因为初始传入的棋子已经是下一方位的棋子了，参考check函数返回值
    if (count >= 4) {
        return true
    } else if (chess[position] && (chess[position].color === undefined || chess[position].color === color)) {
        return checkCount(chess[position], count + 1, position, color)
    } else {
        return false
    }
}

let isAi = false
const start = document.querySelector('.start')
start.addEventListener('click', function (e) {
    start.className += ' start_active'
    start.innerText = '已激活';
    isAi = true
})

const restart = document.querySelector('.restart')
restart.addEventListener('click', function (e) {
    chessArr.forEach((chess) => {
        chess.color = undefined;
        chess.status = 'hidden';
        chess.element.className = 'chess';
    })
    preChess = undefined;
    done = false;
    active = undefined;
    white.click();
})