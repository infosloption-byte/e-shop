<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        // Use a truthy check instead of strict integer check
        if ($request->user() && $request->user()->is_admin) {
            return $next($request);
        }

        // If not admin, block access
        return response()->json([
            'message' => 'Access Denied: Admin privileges required.'
        ], 403);
    }
}