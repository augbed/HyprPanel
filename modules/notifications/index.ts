const notifs = await Service.import("notifications");
import options from "options";
import { notifHasImg } from "../menus/notifications/utils.js";
import { Image } from "./image/index.js";
import { Action } from "./actions/index.js";
import { Header } from "./header/index.js";
import { Body } from "./body/index.js";
import { CloseButton } from "./close/index.js";
import { NotificationAnchor } from "lib/types/options";

const { position } = options.notifications;

export default () => {
    notifs.popupTimeout = 7000;
    const getPosition = (pos: NotificationAnchor): ("top" | "bottom" | "left" | "right")[] => {
        const positionMap: { [key: string]: ("top" | "bottom" | "left" | "right")[] } = {
            "top": ["top"],
            "top right": ["top", "right"],
            "top left": ["top", "left"],
            "bottom": ["bottom"],
            "bottom right": ["bottom", "right"],
            "bottom left": ["bottom", "left"]
        };

        return positionMap[pos] || ["top"];
    }

    return Widget.Window({
        name: "notifications-window",
        class_name: "notifications-window",
        monitor: 2,
        layer: "top",
        anchor: position.bind("value").as(v => getPosition(v)),
        exclusivity: "ignore",
        child: Widget.Box({
            class_name: "notification-card-container",
            vertical: true,
            hexpand: true,
            setup: (self) => {
                self.hook(notifs, () => {
                    return (self.children = notifs.popups.map((notif) => {
                        return Widget.Box({
                            class_name: "notification-card",
                            vpack: "start",
                            hexpand: true,
                            children: [
                                Image(notif),
                                Widget.Box({
                                    vpack: "start",
                                    vertical: true,
                                    hexpand: true,
                                    class_name: `notification-card-content ${!notifHasImg(notif) ? "noimg" : ""}`,
                                    children: [Header(notif), Body(notif), Action(notif, notifs)],
                                }),
                                CloseButton(notif, notifs),
                            ],
                        });
                    }));
                });
            },
        }),
    });
};
