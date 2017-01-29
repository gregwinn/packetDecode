/**
 * Created by gregwinn on 1/29/17.
 *  Expecting full packet from scan: '2,1,6,1a,ff,4c,0,2,15,f7,82,6d,a6,4f,a2,4e,98,80,24,bc,5b,71,e0,89,3e,1d,37,3d,a,b3,b3'
 */

let convertHexToDec = (hexArray) => {
	let converted_array = []

	hexArray.forEach(function(hex){
		converted_array.push(parseInt(hex, 16))
	})
	return converted_array
}

let iBeacon = (packet, callback) => {
	let error = null,
		beacon_id = [],
		returnData = null

	let raw_id = packet.split(',')
	if(raw_id[5] == '4c') {

		// Type is iBeacon
		// UUID starts at raw_id[9]
		let uuid = raw_id.slice(9, 25)
		beacon_id.push(uuid);

		// Major starts at raw_id[24]
		let major = raw_id.slice(25, 27) // Questionable
		// Convert from Hex to Decimal
		let decimal_major = convertHexToDec(major)
		beacon_id.push(decimal_major)

		// Minor starts at raw_id[26]
		let minor = raw_id.slice(27, 29) // Questionable
		// Convert from Hex to Decimal
		let decimal_minor = convertHexToDec(minor)
		beacon_id.push(decimal_minor)

		// Convert iris_id to String and remove commas
		beacon_id = beacon_id.toString()
		beacon_id = beacon_id.replace(/,/g, '')

		returnData = { uuid: uuid.toString().replace(/,/g, ''),
			major: [ major.toString().replace(/,/g, ''), decimal_major.toString().replace(/,/g, '') ],
			minor: [ minor.toString().replace(/,/g, ''), decimal_minor.toString().replace(/,/g, '') ],
			data: beacon_id,
			type: 'iBeacon' }

	} else {
		error = true
	}
	return callback(error, returnData)
}

let packetDecode = {
	iBeacon: iBeacon
}

module.exports = packetDecode
