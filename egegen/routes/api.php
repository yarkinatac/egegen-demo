<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ProductFieldController;
use App\Http\Controllers\Api\VariationAttributeController;

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/detail/{slug}', [ProductController::class, 'show']);
Route::post('/products', [ProductController::class, 'store']);
Route::put('/products/{id}', [ProductController::class, 'update']);
Route::delete('/products/{id}', [ProductController::class, 'destroy']);

Route::get('/fields', [ProductFieldController::class, 'index']);
Route::post('/fields', [ProductFieldController::class, 'store']);
Route::put('/fields/{id}', [ProductFieldController::class, 'update']);
Route::delete('/fields/{id}', [ProductFieldController::class, 'destroy']);

Route::get('/attributes', [VariationAttributeController::class, 'index']);
Route::post('/attributes', [VariationAttributeController::class, 'store']);
Route::put('/attributes/{id}', [VariationAttributeController::class, 'update']);
Route::delete('/attributes/{id}', [VariationAttributeController::class, 'destroy']);