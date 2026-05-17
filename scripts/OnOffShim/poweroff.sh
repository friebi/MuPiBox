#!/bin/bash

CONFIG="/etc/mupibox/mupiboxconfig.json"
POWEROFF_PIN=$(/usr/bin/jq -r .shim.poweroffPin ${CONFIG})
CUT_PIN=$(/usr/bin/jq -r .shim.cutPin ${CONFIG})

GPIO_CHIP=$(ls /dev/ | grep -m 1 gpiochip)
if [ -z "$GPIO_CHIP" ]; then
    echo "$(date) - ERROR: No GPIO chip found, aborting."
    exit 1
else
    echo "$(date) - INFO:  GPIO chip found -> ${GPIO_CHIP}"
fi

if [ "$1" = "poweroff" ]; then
    echo "$(date): Initiating poweroff sequence"

    # CUT_PIN setzen (z. B. Stromzufuhr abschalten)
    gpioset --chip ${GPIO_CHIP} ${CUT_PIN}=1

    # POWEROFF_PIN setzen (Signal an OnOff SHIM)
    gpioset --chip ${GPIO_CHIP} ${POWEROFF_PIN}=0

    echo "$(date): Poweroff sequence complete"
fi
