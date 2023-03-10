<?php

namespace Common\Domains;

use Closure;
use Illuminate\Http\Request;

class CustomDomainsEnabled
{
    public function handle(Request $request, Closure $next)
    {
        if ( ! config('common.site.enable_custom_domains')) {
            abort(404);
        }

        return $next($request);
    }
}
