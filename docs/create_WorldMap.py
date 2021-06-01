seaopen = 1

def f(begin, end):
    return list(range(begin, end + 1))

def expand(l):
    ll = []
    for i in l:
        if type(i) is list:
            for j in i: ll.append(j)
        else:
            ll.append(i)
    return ll

tmp = 0
land = [20, 45, 46, 68, 69, 70, 71, 94, 95, 96, 104, 105, 106, 108, 119, 120, 121, 
        f(129, 133), 140, f(143, 146), 155, 156, 157, 164, 166
        , 168, 169, 170, 171, 179, 180, 181, f(190, 196), 204, 205,
        206, 209, f(213, 221), 233, 234, f(238, 247), 259, f(261, 273), f(285, 297),
        f(313, 322), f(337, 347), f(361, 371), f(388, 396), f(413, 421), 437,
        f(439, 446), 456, 457, f(460, 470), 482, f(484, 486), f(488, 495), f(506, 521), f(530, 546),
        f(555, 563), f(565, 568), 570, 571, f(582, 589), f(591, 595), f(610, 614), 616, 617, 619, f(635, 642), 
        f(660, 663), f(686, 687), 694, 699, f(722, 725), f(746, 750), 758, f(770, 775), f(781, 783), f(794, 800), 
        f(805, 809), f(820, 825), f(829, 835), 842, f(848, 849), f(852, 860), f(867, 868), 870, f(873, 874), f(876, 879),
        f(882, 885), f(891, 896), f(899, 900), f(909, 910), f(914, 917), f(921, 925), 936, f(939, 943), f(945, 949),
        962, f(964, 974), f(987, 999), f(1013, 1023), f(1038, 1048), f(1065, 1072), f(1092, 1096), f(1119, 1121), 
        f(1144, 1146), f(1169, 1171), 1187, f(1193, 1196), 1212, f(1219, 1221)]

land = expand(land)
for i in range(len(land)):
    land[i] -= 1

f = open("C:\\Users\\terry\\Desktop\\buildings.json", "w")
f.write('{\n '
       '"buildings" : [ {"id":"LIB","title":"圖書館","location":[-8,0,-30], "size" :[20, 16 ,10] , "color":"0x08aeff", "floor":8 }, \n'
                   '{"id":"EECS","title":"電機資訊學院","location":[-35,0,-35], "size" :[20, 18 ,20] , "color":"0x08aeff", "floor":9 }, \n '
                   '{"id":"CC","title":"資訊中心","location":[-8,0,-45], "size" :[15, 8 ,10] , "color":"0x08aeff", "floor":4 }, \n'
                   '{"id":"SS","title":"社會科學學院","location":[20,0,-37], "size" :[20, 16 ,25] , "color":"0x08aeff", "floor":8 }, \n '
                   '{"id":"ADM","title":"行政大樓","location":[20,0,-5], "size" :[20, 14 ,25] , "color":"0x08aeff", "floor":7 }, \n'
                   '{"id":"PA","title":"公共事務學院","location":[-35,0,-5], "size" :[20, 18 ,25] , "color":"0x08aeff", "floor":9 }, \n'
                   '{"id":"LAW","title":"法律學院","location":[-37,0,32], "size" :[20, 16 ,35] , "color":"0x08aeff", "floor":8 } ,\n'
                   '{"id":"BUS","title":"商學院","location":[20,0,32], "size" :[20, 18 ,25] , "color":"0x08aeff", "floor":9 } ,\n'
                   '{"id":"HUM","title":"人文學院","location":[50,0,22], "size" :[25, 26 ,15] , "color":"0x08aeff", "floor":13 } ,\n')

flag = 0

for i in range(0, -150, -3):
    for j in range(10, 85, 3):
        colorsea = '0xFFFFFF'
        colorland = '0X136D15'
        # if tmp in land, then colorland, else colorsea
        # pythonic 寫法: colorland if tmp in land, else colorsea
        if tmp in land:
            if flag == 1: f.write(',\n')
            f.write(s := '{"id":"GW%s","title":"GateWay","location":[%s,%s,%s], "size" :[3,3,3] , "color":"%s", "floor":1 }' \
            % (tmp, i, j, -200 - i, colorland))
        else :
            if seaopen == 1:
                if flag == 1: f.write(',\n')
                f.write(s := '{"id":"GW%s","title":"GateWay","location":[%s,%s,%s], "size" :[3,3,3] , "color":"%s", "floor":1 }' \
                % (tmp, i, j, -200 - i, colorsea))
            pass
        flag = 1
        tmp += 1
f.write('\n]}')
print("Completed!")
f.close()