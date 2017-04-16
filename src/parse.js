"use strict";


function findSuffix(line, tabIndex) {
		//Find closest suffix
		var suffixC = line.indexOf(" C ");
		if (suffixC < 0) suffixC = 100;
		var suffixCt = line.indexOf(" C\t");
		if (suffixCt < 0) suffixCt = 100;
		var suffixE = line.indexOf(" E ");
		if (suffixE < 0) suffixE = 100;
		var suffixEt = line.indexOf(" E\t");
		if (suffixEt < 0) suffixEt = 100;
		var suffixLE = line.indexOf(" LE ");
		if (suffixLE < 0) suffixLE = 100;
		var suffixLEt = line.indexOf(" LE\t");
		if (suffixLEt < 0) suffixLEt = 100;
		var suffixP = line.indexOf(" P ");
		if (suffixP < 0) suffixP = 100;
		var suffixPt = line.indexOf(" P\t");
		if (suffixPt < 0) suffixPt = 100;
		var suffixS = line.indexOf(" S ");
		if (suffixS < 0) suffixS = 100;
		var suffixSt = line.indexOf(" S\t");
		if (suffixSt < 0) suffixSt = 100;
		var suffixTS = line.indexOf(" TS ");
		if (suffixTS < 0) suffixTS = 100;
		var suffixTSt = line.indexOf(" TS\t");
		if (suffixTSt < 0) suffixTSt = 100;

		var smallestIndex = Math.min(suffixC, suffixE, suffixLE, suffixP, suffixS, suffixTS, suffixCt, suffixEt, suffixLEt, suffixPt, suffixSt, suffixTSt);
		if (smallestIndex == 100) smallestIndex = tabIndex;
		return smallestIndex;
}