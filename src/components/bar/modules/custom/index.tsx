import options from 'src/options';
import { Module } from '../../shared/Module';
import { inputHandler } from 'src/components/bar/utils/helpers';
import { BashPoller } from 'src/lib/poller/BashPoller';
import { bind, Variable } from 'astal';
import { BarBoxChild } from 'src/lib/types/bar';
import { Astal } from 'astal/gtk3';

const { label, leftClick, rightClick, middleClick, pollingInterval, pollingCommand, icon } =
    options.bar.customModules.custom;

const customData: Variable<string> = Variable('');
const processCustom = (customData: string): string => {
    return customData
};


const customPoller = new BashPoller<string, []>(
    customData,
    [bind(pollingCommand)],
    bind(pollingInterval),
    pollingCommand.get(),
    processCustom,
);

customPoller.initialize('custom');

export const Custom = (): BarBoxChild => {
    const customModule = Module({
        textIcon: bind(icon),
        label: bind(customData),
        boxClass: 'custom',
        showLabelBinding: bind(label),
        props: {
            setup: (self: Astal.Button) => {
                inputHandler(self, {
                    onPrimaryClick: {
                        cmd: leftClick,
                    },
                    onSecondaryClick: {
                        cmd: rightClick,
                    },
                    onMiddleClick: {
                        cmd: middleClick,
                    },
                });
            },
        },
    });

    return customModule;
};
