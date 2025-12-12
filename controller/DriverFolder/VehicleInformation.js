import VehicleInfo from "../../Model/DriverModel/VehicleInformationModel.js";
import DriverData from "../../Model/CommonModel/UserModel.js";

export const addVehicleInfo = async (req, res) => {
  try {
    const { driverId, brand, color, registration_number, plate_number } =
      req.query;

    const driver = await DriverData.findOne({ id: Number(driverId) });
    if (!driver) {
      return res.status(404).json({ msg: "Driver not found" });
    }

    const lastVehicle = await VehicleInfo.findOne().sort({ id: -1 });
    const newId = lastVehicle ? lastVehicle.id + 1 : 1;

    const files = req.files;

    const front_license = files.front_license
      ? files.front_license[0].path
      : null;
    const back_license = files.back_license ? files.back_license[0].path : null;
    const selfie_license = files.selfie_license
      ? files.selfie_license[0].path
      : null;

    const front_identity_document = files.front_identity_document
      ? files.front_identity_document[0].path
      : null;

    const back_identity_document = files.back_identity_document
      ? files.back_identity_document[0].path
      : null;

    const selfie_identity_document = files.selfie_identity_document
      ? files.selfie_identity_document[0].path
      : null;

    const newDriverInfo = new VehicleInfo({
      id: newId,
      driverId: driver.id,
      brand,
      color,
      registration_number,
      plate_number,
      front_license,
      back_license,
      selfie_license,
      front_identity_document,
      back_identity_document,
      selfie_identity_document,
    });

    await newDriverInfo.save();
    console.log(newDriverInfo);

    await DriverData.findOneAndUpdate(
      { id: driver.id },
      { verify: "YES" },
      { new: true }
    );

    res.status(201).json({
      msg: "Driver information added successfully",
      data: newDriverInfo,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

