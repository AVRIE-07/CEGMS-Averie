import bcryptjs from "bcryptjs";
import crypto from "crypto";

import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import {
  sendPasswordResetEmail,
  sendResetSuccessEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../mailtrap/emails.js";

import User from "../models/user.model.js";
export const register = async (req, res) => {
  const user = req.body;

  if (
    !user.first_name ||
    !user.last_name ||
    !user.email ||
    !user.phone_number ||
    !user.country ||
    !user.region ||
    !user.city ||
    !user.address ||
    !user.zip_code ||
    !user.emergency_contact_full_name ||
    !user.emergency_contact_number ||
    !user.role ||
    !user.password
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all fields" });
  }
  try {
    const userAlreadyExists = await User.findOne({ email: user.email });
    if (userAlreadyExists) {
      return res.status(400).json({
        success: false,
        message: "Email already exists.",
      });
    }

    const hashedPassword = await bcryptjs.hash(user.password, 10);

    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const lastUser = await User.findOne().sort({ user_id: -1 });
    const newUserId =
      lastUser && lastUser.user_id != null ? lastUser.user_id + 1 : 1;

    const newUser = new User({
      ...user,
      user_id: newUserId,
      password: hashedPassword,
      role: role || "PE",
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });

    await newUser.save();

    generateTokenAndSetCookie(res, newUser._id);

    await sendVerificationAdminEmail(
      user.email,
      verificationToken,
      user.password
    );

    res.status(201).json({ success: true, data: newUser });
  } catch (error) {
    console.error("Error in create user:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const verifyEmail = async (req, res) => {
  const { code } = req.body;
  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    await sendWelcomeEmail(user.email, user.name);

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("error in verifyEmail ", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email && !password) {
    return res.status(400).json({
      success: false,
      error: {
        code: "MISSING_FIELDS",
        message: "Email and password are required.",
      },
    });
  }

  if (!email) {
    return res.status(400).json({
      success: false,
      error: {
        code: "MISSING_FIELDS",
        message: "Email is required.",
      },
    });
  }

  if (!password) {
    return res.status(400).json({
      success: false,
      error: {
        code: "MISSING_FIELDS",
        message: "Password is required.",
      },
    });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        error: {
          code: "USER_NOT_FOUND",
          message: "No user found with the provided email.",
        },
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        error: {
          code: "EMAIL_NOT_VERIFIED",
          message: "Pls Verify your email.",
        },
      });
    }

    if (!user.isApproved) {
      return res.status(403).json({
        success: false,
        error: {
          code: "ACCOUNT_NOT_APPROVED",
          message: "Account not approved by admin.",
        },
      });
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        error: {
          code: "INVALID_CREDENTIALS",
          message: "Invalid credentials.",
        },
      });
    }

    generateTokenAndSetCookie(res, user._id);

    user.lastLogin = new Date();
    await user.save();
    console.log("Successfull sa backend lodiiii");
    res.status(200).json({
      success: true,
      message: "Logged in successfully.",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
    console.log("Successfull sa backend tngina");
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "SERVER_ERROR",
        message: "An unexpected error occurred. Please try again later.",
        details: error.message,
      },
    });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!email) {
      return res.status(400).json({
        success: false,
        error: {
          code: "MISSING_FIELDS",
          message: "Email is required.",
        },
      });
    }

    if (!user) {
      return res.status(400).json({
        success: false,
        error: {
          code: "USER_NOT_FOUND",
          message: "No user found with the provided email.",
        },
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;

    await user.save();

    // send email
    await sendPasswordResetEmail(
      user.email,
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    );

    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    console.log("Error in forgotPassword ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    // Check if password or confirm password is missing
    if (!password && !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password are required.",
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "New password is required.",
      });
    }

    if (!confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Confirm password is required.",
      });
    }

    // Check if new password and confirm password match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password do not match.",
      });
    }

    // Find user with matching reset token and check if it is expired
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    // Hash and update password
    const hashedPassword = await bcryptjs.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;

    await user.save();

    // Send success email
    await sendResetSuccessEmail(user.email);

    return res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    console.log("Error in resetPassword ", error);
    return res.status(400).json({
      success: false,
      message: error.message || "An error occurred during the reset process",
    });
  }
};

export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("Error in checkAuth ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};
