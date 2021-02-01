import pandas as pd
import numpy as np
import math, os

def query_ip(ip):
    ips = ip.split(".")
    ip = ''
    for i in range(len(ips)):
        ips[i] = ips[i].zfill(3)
    ip = ".".join(ips)
    df = pd.read_csv('output.csv', encoding = "ANSI", sep = ',')
    df = df.fillna(0)
    try:
        mask1 = 1 if len(ip) == 0 else (df['IP位址'] == ip)
        result = df[mask1].values.tolist()
        if result:
            return str(result[0][1])+str(result[0][2]),str(result[0][5])
        else:
            return '0','0'
    except KeyError as err:
        err="KeyError("+str(err)+")"
        print(err)

if __name__ == "__main__":
    print(query_ip('010.141.051.153'))
    