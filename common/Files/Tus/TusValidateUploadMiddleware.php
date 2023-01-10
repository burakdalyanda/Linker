<?php

namespace Common\Files\Tus;

use Common\Files\Actions\ValidateFileUpload;
use TusPhp\Middleware\TusMiddleware;
use TusPhp\Request;
use TusPhp\Response;

class TusValidateUploadMiddleware implements TusMiddleware
{
    public function handle(Request $request, Response $response)
    {
        if (empty($meta)) {
            return;
        }

        $meta = $request->extractAllMeta();
        $errors = app(ValidateFileUpload::class)->execute([
            'size' => $meta['clientSize'],
            'extension' => $meta['clientExtension'],
        ]);

        if ($errors) {
            abort(422, $errors->first());
        }
    }
}
