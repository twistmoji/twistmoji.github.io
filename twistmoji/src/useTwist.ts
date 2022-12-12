import { useCallback, useEffect, useState } from 'react';

export const useTwist = () => {
    const twist = {
        symbols: {
            leftHand: "⬅️✋",
            rightHand: "➡️🤚",
            leftFoot: "⬅️🦶",
            rightFoot: "➡️🦶"
        },
        colors: {
            mat: {
                red: "🔴",
                green: "🟢",
                blue: "🔵",
                yellow: "🟡"
            },
            placeholder: {
                white: "⚪️"
            }
        }
    };
    const [lastSpin, setLastSpin] = useState<{ symbol: string, color: string }>();
    const [currentPositions, setCurrentPositions] = useState({
        [twist.symbols.leftHand]: twist.colors.placeholder.white,
        [twist.symbols.rightHand]: twist.colors.placeholder.white,
        [twist.symbols.leftFoot]: twist.colors.placeholder.white,
        [twist.symbols.rightFoot]: twist.colors.placeholder.white,
    });
    const spin = useCallback(() => {
        const randomPropertyValue = (object: { [s: string]: string; }): string => {
            const values = Object.values(object);
            return values[Math.floor(Math.random() * values.length)];
        };
        const randomSymbol = randomPropertyValue(twist.symbols);
        const randomColor = randomPropertyValue(twist.colors.mat);
        if (currentPositions[randomSymbol] === randomColor) {
            spin();
        }
        else {
            setLastSpin({ symbol: randomSymbol, color: randomColor });
            setCurrentPositions({
                ...currentPositions,
                [randomSymbol]: randomColor,
            });
        }
    }, [currentPositions, twist.colors.mat, twist.symbols]);
    const [announced, setAnnounced] = useState(false);
    useEffect(() => {
        if (lastSpin) {
            const utterances = {
                symbols: {
                    [twist.symbols.leftHand]: 'left hand',
                    [twist.symbols.rightHand]: 'right hand',
                    [twist.symbols.leftFoot]: 'left foot',
                    [twist.symbols.rightFoot]: 'right foot',
                },
                colors: {
                    [twist.colors.mat.red]: 'red',
                    [twist.colors.mat.green]: 'green',
                    [twist.colors.mat.blue]: 'blue',
                    [twist.colors.mat.yellow]: 'yellow',
                },
            };
            if (!announced) {
                setAnnounced(true);
                speechSynthesis.speak(new SpeechSynthesisUtterance("Twistmoji"));
            } else {
                speechSynthesis.speak(
                    new SpeechSynthesisUtterance(`${utterances.symbols[lastSpin.symbol]} ${utterances.colors[lastSpin.color]}`)
                );
            }
        }
    }, [lastSpin, announced, setAnnounced, twist.symbols.leftHand, twist.symbols.rightHand, twist.symbols.leftFoot, twist.symbols.rightFoot, twist.colors.mat.red, twist.colors.mat.green, twist.colors.mat.blue, twist.colors.mat.yellow]);
    return {
        twist,
        lastSpin,
        currentPositions,
        spin
    };
};
