<template>
    <div class="page-banner">
        <div class="main-container">
            <div id="content">
                <h2 class="title">{{ $route.name }}</h2>
                <ul class="breadcrumb-list">
                    <li><a href="/">Home</a></li>
                    <li><a href="javascript:void(0)">{{ $route.name }}</a></li>
                </ul>
            </div>
        </div>
    </div>
</template>