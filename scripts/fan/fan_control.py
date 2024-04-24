# Created by: Michael Klements
# For 40mm 5V PWM Fan Control On A Raspberry Pi

import RPi.GPIO as IO          # Calling GPIO to allow use of the GPIO pins
import time                    # Calling time to allow delays to be used
import subprocess              # Calling subprocess to get the CPU temperature
import json

def read_json(JSON_DATA_FILE):
    try:
        with open(JSON_DATA_FILE) as file:
            rc = file.read()   # read first time
        rc = json.loads(rc)
    except:
        rc = "skip"
    return rc

def write_json(data, JSON_DATA_FILE):
    with open(JSON_DATA_FILE, 'w') as file:
        json.dump(data, file)

def get_temp():                              # Function to read in the CPU temperature and return it as a float in degrees celcius
    output = subprocess.run(['vcgencmd', 'measure_temp'], capture_output=True)
    temp_str = output.stdout.decode()
    try:
        return float(temp_str.split('=')[1].split('\'')[0])
    except (IndexError, ValueError):
        raise RuntimeError('Could not get temperature')

def main():
    JSON_DATA = "skip"
    while JSON_DATA == "skip":
        JSON_DATA = read_json("/etc/mupibox/mupiboxconfig.json")
    GPIO = int(JSON_DATA['fan']['fan_gpio'])
    FAN100 = int(JSON_DATA['fan']['fan_temp_100'])
    FAN75 = int(JSON_DATA['fan']['fan_temp_75'])
    FAN50 = int(JSON_DATA['fan']['fan_temp_50'])
    FAN25 = int(JSON_DATA['fan']['fan_temp_25'])
    HAT_STATE = JSON_DATA['mupihat']['hat_active']
    IO.setwarnings(False)                                 # Do not show any GPIO warnings
    IO.setmode (IO.BCM)                                   # BCM pin numbers - PIN8 as ‘GPIO13’
    IO.setup(GPIO,IO.OUT)                                 # Initialize GPIO13 as our fan output pin
    fan = IO.PWM(GPIO,100)                                # Set GPIO13 as a PWM output, with 100Hz frequency (this should match your fans specified PWM frequency)
    fan.start(0)                                          # Generate a PWM signal with a 0% duty cycle (fan off)
    while 1:                                              # Execute loop forever
        if HAT_STATE == "true":
            JSON_DATA = "-"
        else:
            JSON_DATA = "skip"
        while JSON_DATA == "skip":
            JSON_DATA = read_json("/tmp/mupihat.json")
        ictemp = int(JSON_DATA['Temp'])
        cputemp = int(get_temp())                               # Get the current CPU temperature
        if cputemp > FAN100 or ictemp > FAN100:     # Check temperature threshhold, in degrees celcius
            fan.ChangeDutyCycle(100)            # Set fan duty based on temperature, 100 is max speed and 0 is min speed or off.
            speed = "100%"
        elif cputemp > FAN75 or ictemp > FAN75:
            fan.ChangeDutyCycle(75)
            speed = "75%"
        elif cputemp > FAN50 or ictemp > FAN50:
            fan.ChangeDutyCycle(50)
            speed = "50%"
        elif cputemp > FAN25 or ictemp > FAN25:
            fan.ChangeDutyCycle(25)
            speed = "25%"
        else:
            fan.ChangeDutyCycle(0)
            speed = "0%"
        # Daten in JSON-Objekt schreiben
        data = {
            "ictemp": ictemp,
            "cputemp": cputemp,
            "speed": speed
        }
        write_json(data, "/tmp/fan.json")
        
        time.sleep(15)                            # Sleep for 5 seconds
        
if __name__ == "__main__":
    main()