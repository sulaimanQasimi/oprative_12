<?php

namespace App\Pos\Account\Services\Traits\Profile;

use App\Pos\Account\Helpers\Response;
use App\Pos\Account\Services\Contracts\WebResponse;

trait User
{
    /**
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function profile(\Illuminate\Http\Request $request,string $type="api"): \Illuminate\Http\JsonResponse|WebResponse
    {
        $user = $request->user();
        if($this->resource){
            $user = $this->resource::make($user);
        }
        return Response::data($user, __("Profile Data Load"));
    }
}
