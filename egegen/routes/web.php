<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\FieldController;
use App\Http\Controllers\Admin\AttributeController;

Route::get('/', function () {
    return view('welcome');
});

Route::prefix('admin')->group(function () {
    Route::resource('products', ProductController::class);
    Route::resource('fields', FieldController::class);
    Route::resource('attributes', AttributeController::class);
});