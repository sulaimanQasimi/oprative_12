<?php

namespace App\Pos\Account\Services\Traits\Profile;

use App\Pos\Account\Helpers\Response;
use App\Pos\Account\Services\Contracts\WebResponse;

trait Delete
{
    /**
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(\Illuminate\Http\Request $request,string $type="api"): \Illuminate\Http\JsonResponse|WebResponse
    {
        $user = $request->user();
        $this->model::where("username", $user->username)->delete();

        if($type === 'api'){
            return Response::success(__('Account Has Been Deleted'));
        }
        else {
            return WebResponse::make(__('Account Has Been Deleted'))->success();
        }

    }
}
