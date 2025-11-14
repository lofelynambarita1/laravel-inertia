<?php

namespace App\Http\Controllers;

use App\Models\Todo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class TodoController extends Controller
{
    public function index(Request $request)
    {
        $query = Todo::where('user_id', Auth::id());

        // Search
        if ($request->has('search') && $request->search != '') {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', '%' . $request->search . '%')
                    ->orWhere('description', 'like', '%' . $request->search . '%');
            });
        }

        // Filter by status
        if ($request->has('status') && $request->status != '') {
            if ($request->status === 'completed') {
                $query->where('is_finished', true);
            } elseif ($request->status === 'pending') {
                $query->where('is_finished', false);
            }
        }

        // Get statistics
        $statistics = [
            'total' => Todo::where('user_id', Auth::id())->count(),
            'completed' => Todo::where('user_id', Auth::id())->where('is_finished', true)->count(),
            'pending' => Todo::where('user_id', Auth::id())->where('is_finished', false)->count(),
        ];

        // Pagination
        $todos = $query->orderBy('created_at', 'desc')->paginate(20)->withQueryString();

        return Inertia::render('app/TodoPage', [
            'todos' => $todos,
            'statistics' => $statistics,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'cover' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $coverPath = null;
        if ($request->hasFile('cover')) {
            $coverPath = $request->file('cover')->store('todos', 'public');
        }

        Todo::create([
            'user_id' => Auth::id(),
            'title' => $request->title,
            'description' => $request->description,
            'cover' => $coverPath,
            'is_finished' => false,
        ]);

        return redirect()->route('todos.index')->with('success', 'Todo berhasil ditambahkan!');
    }

    public function update(Request $request, Todo $todo)
    {
        // Check ownership
        if ($todo->user_id !== Auth::id()) {
            abort(403);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'cover' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $data = [
            'title' => $request->title,
            'description' => $request->description,
        ];

        // Handle cover upload
        if ($request->hasFile('cover')) {
            // Delete old cover
            if ($todo->cover) {
                Storage::disk('public')->delete($todo->cover);
            }
            $data['cover'] = $request->file('cover')->store('todos', 'public');
        }

        $todo->update($data);

        return redirect()->route('todos.index')->with('success', 'Todo berhasil diperbarui!');
    }

    public function toggleStatus(Todo $todo)
    {
        // Check ownership
        if ($todo->user_id !== Auth::id()) {
            abort(403);
        }

        $todo->update([
            'is_finished' => !$todo->is_finished,
        ]);

        return redirect()->route('todos.index')->with('success', 'Status todo berhasil diubah!');
    }

    public function destroy(Todo $todo)
    {
        // Check ownership
        if ($todo->user_id !== Auth::id()) {
            abort(403);
        }

        // Delete cover if exists
        if ($todo->cover) {
            Storage::disk('public')->delete($todo->cover);
        }

        $todo->delete();

        return redirect()->route('todos.index')->with('success', 'Todo berhasil dihapus!');
    }
}