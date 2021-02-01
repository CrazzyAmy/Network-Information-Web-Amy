import pandas as pd
import numpy as np
import math, os

def querey_building_and_floor(building="",floor=""):
    df = pd.read_csv('output.csv', encoding = "ANSI", sep = ',')
    try:
        building = '法學大樓'
        floor = '3F'
        mask1 = 1 if len(building) == 0 else (df['大樓'] == building)
        mask2 = 1 if len(floor) == 0 else (df['樓層'] == floor)

        result = df[(mask1 & mask2)].values.tolist()
        for row in result:
            tmp = ('.').join([str(int(j)) for j in row[0].split('.')])
            print(tmp)
    except KeyError as err:
        err="KeyError("+str(err)+")"
        print(err)
if __name__ == "__main__":
    querey_building_and_floor()
    