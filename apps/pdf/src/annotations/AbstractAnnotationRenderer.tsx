import * as React from "react";
import {Debouncers} from "polar-shared/src/util/Debouncers";
import {useComponentDidMount} from "../../../../web/js/hooks/lifecycle";

export function useAnnotationContainer(page: number) {

    const [container, setContainer] = React.useState<HTMLElement | undefined>();

    useComponentDidMount(() => {

        // update and get the container...
        const doUpdate = () => {

            const getContainer = (): HTMLElement | undefined => {

                const pageElement = document.querySelector(`.page[data-page-number='${page}']`);

                if (! pageElement) {
                    return undefined;
                }

                const textLayerElement = pageElement.querySelector(".textLayer");

                if (! textLayerElement) {
                    return undefined;
                }

                return textLayerElement as HTMLElement;

            };

            const newContainer = getContainer();

            if (container !== newContainer) {
                setContainer(newContainer);
            }

        };

        doUpdate();

        const doUpdateDebouncer = Debouncers.create(() => doUpdate());

        const registerScrollListener = () => {
            const viewerContainer = document.getElementById('viewerContainer');
            viewerContainer!.addEventListener('scroll', () => doUpdateDebouncer());
        };

        const registerResizeListener = () => {
            window.addEventListener('resize', () => doUpdateDebouncer());
        };

        // FIXME: should I use effect?
        // FIXME: remove event listeners on unmount...

        registerScrollListener();
        registerResizeListener();

    });

    return container;

}
