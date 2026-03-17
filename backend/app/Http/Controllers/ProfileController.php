<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Address;
use Illuminate\Support\Facades\Hash;

class ProfileController extends Controller {
    
    // Update basic info
    public function updateProfile(Request $request) {
        $user = auth()->user();
        $data = $request->validate([
            'name' => 'string|max:255',
            'phone_number' => 'string|unique:users,phone_number,' . $user->id,
        ]);

        $user->update($data);
        return response()->json(['message' => 'Profile updated successfully', 'user' => $user]);
    }

    // Manage Addresses
    public function addAddress(Request $request) {
        $request->validate([
            'address_line' => 'required|string',
            'city' => 'required|string',
            'is_default' => 'boolean'
        ]);

        // If setting as default, unset others first
        if ($request->is_default) {
            auth()->user()->addresses()->update(['is_default' => false]);
        }

        $address = auth()->user()->addresses()->create($request->all());
        return response()->json($address, 201);
    }

    // Password Reset (Secure Internal)
    public function updatePassword(Request $request) {
        $request->validate([
            'current_password' => 'required|current_password',
            'new_password' => 'required|min:8|confirmed',
        ]);

        auth()->user()->update([
            'password' => Hash::make($request->new_password)
        ]);

        return response()->json(['message' => 'Password changed successfully']);
    }

    public function sendPhoneOTP(Request $request) {
        $user = auth()->user();
        $otp = rand(100000, 999999);
        
        // Store OTP in cache for 10 minutes
        cache()->put('otp_' . $user->id, $otp, now()->addMinutes(10));

        // For Sri Lankan numbers, ensure the +94 prefix is handled
        // Example using an SMS Gateway (Log for now)
        \Log::info("OTP for User {$user->id}: {$otp}");
        
        // In production: $smsProvider->send($user->phone_number, "Your Oveena code is: $otp");

        return response()->json(['message' => 'OTP sent to your phone']);
    }

    public function verifyPhoneOTP(Request $request) {
        $request->validate(['otp' => 'required|numeric']);
        $user = auth()->user();

        if ($request->otp == cache()->get('otp_' . $user->id)) {
            $user->update(['phone_verified_at' => now()]);
            cache()->forget('otp_' . $user->id);
            return response()->json(['message' => 'Phone verified successfully']);
        }

        return response()->json(['message' => 'Invalid or expired OTP'], 422);
    }
}