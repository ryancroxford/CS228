fileIn = open("iris.csv","r")

print("var irisData = nj.array([[")
for line in fileIn:
        print("[" + line.rstrip('\n') +"],")
print("]);")

fileIn.close()
